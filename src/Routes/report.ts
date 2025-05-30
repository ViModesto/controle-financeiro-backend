// Routes/reports.ts
import { Router, Request, Response } from "express";

const router = Router();

// Interfaces para tipagem
interface ReportFilters {
  reportType: string;
  account: string;
  analysisBy: string;
  situation: string;
  startDate: string;
  endDate: string;
  includeTransfers: boolean;
}

interface ReportItem {
  name: string;
  monthlyValues: number[];
  total: number;
}

interface ReportCategory {
  category: string;
  items: ReportItem[];
}

interface ReportData {
  expenses: ReportCategory[];
  months: string[];
  monthlyTotals: number[];
  totalGeneral: number;
  period: string;
  situation: string;
}

interface ApiResponse {
  success: boolean;
  data?: ReportData;
  error?: string;
}

// Função para converter data DD/MM/AAAA para objeto Date
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Função para validar formato de data
const isValidDateFormat = (dateString: string): boolean => {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(dateString);
};

// Função para gerar dados mock baseados nos filtros
const generateMockData = (filters: ReportFilters): ReportData => {
  const { reportType, startDate, endDate } = filters;

  // Gerar meses entre as datas
  const start: Date = parseDate(startDate);
  const end: Date = parseDate(endDate);
  const months: string[] = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);

  while (current <= end) {
    const monthNames: string[] = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const monthName: string = monthNames[current.getMonth()];
    const year: number = current.getFullYear();
    months.push(`${monthName}/${year}`);

    current.setMonth(current.getMonth() + 1);
  }

  // Dados mock para despesas
  const expensesData: ReportCategory[] = [
    {
      category: "Alimentação",
      items: [
        {
          name: "Supermercado",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 500 + 200) * 100) / 100
          ),
          total: 0,
        },
        {
          name: "Restaurantes",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 300 + 100) * 100) / 100
          ),
          total: 0,
        },
      ],
    },
    {
      category: "Transporte",
      items: [
        {
          name: "Combustível",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 400 + 150) * 100) / 100
          ),
          total: 0,
        },
        {
          name: "Manutenção",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 200 + 50) * 100) / 100
          ),
          total: 0,
        },
      ],
    },
    {
      category: "Moradia",
      items: [
        {
          name: "Aluguel",
          monthlyValues: months.map(() => 1200.0),
          total: 0,
        },
        {
          name: "Contas",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 300 + 200) * 100) / 100
          ),
          total: 0,
        },
      ],
    },
  ];

  // Dados mock para receitas
  const revenuesData: ReportCategory[] = [
    {
      category: "Salário",
      items: [
        {
          name: "Salário Principal",
          monthlyValues: months.map(() => 5000.0),
          total: 0,
        },
        {
          name: "Bônus",
          monthlyValues: months.map(
            () => Math.round(Math.random() * 1000 * 100) / 100
          ),
          total: 0,
        },
      ],
    },
    {
      category: "Investimentos",
      items: [
        {
          name: "Dividendos",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 500 + 100) * 100) / 100
          ),
          total: 0,
        },
        {
          name: "Juros",
          monthlyValues: months.map(
            () => Math.round((Math.random() * 200 + 50) * 100) / 100
          ),
          total: 0,
        },
      ],
    },
  ];

  // Escolher dados baseado no tipo de relatório
  const selectedData: ReportCategory[] =
    reportType === "Planilha de despesas" ? expensesData : revenuesData;

  // Calcular totais
  let totalGeneral: number = 0;
  const monthlyTotals: number[] = new Array(months.length).fill(0);

  selectedData.forEach((category: ReportCategory) => {
    category.items.forEach((item: ReportItem) => {
      item.total =
        Math.round(
          item.monthlyValues.reduce(
            (sum: number, value: number) => sum + value,
            0
          ) * 100
        ) / 100;
      totalGeneral += item.total;

      item.monthlyValues.forEach((value: number, index: number) => {
        monthlyTotals[index] += value;
      });
    });
  });

  // Arredondar totais mensais
  monthlyTotals.forEach((total, index) => {
    monthlyTotals[index] = Math.round(total * 100) / 100;
  });

  totalGeneral = Math.round(totalGeneral * 100) / 100;

  return {
    expenses: selectedData,
    months,
    monthlyTotals,
    totalGeneral,
    period: `${startDate} - ${endDate}`,
    situation: filters.situation || "Todas",
  };
};

// Rota para gerar relatórios
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      reportType,
      account,
      analysisBy,
      situation,
      startDate,
      endDate,
      includeTransfers,
    }: ReportFilters = req.body;

    // Validações
    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: "Período inicial e final são obrigatórios",
      } as ApiResponse);
      return;
    }

    // Validar formato das datas
    if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
      res.status(400).json({
        success: false,
        error: "Formato de data inválido. Use DD/MM/AAAA",
      } as ApiResponse);
      return;
    }

    // Validar se a data inicial é menor que a final
    const start: Date = parseDate(startDate);
    const end: Date = parseDate(endDate);

    if (start > end) {
      res.status(400).json({
        success: false,
        error: "Data inicial deve ser menor que a data final",
      } as ApiResponse);
      return;
    }

    // Gerar dados do relatório
    const reportData: ReportData = generateMockData({
      reportType,
      account,
      analysisBy,
      situation,
      startDate,
      endDate,
      includeTransfers,
    });

    res.json({
      success: true,
      data: reportData,
    } as ApiResponse);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    } as ApiResponse);
  }
});

// Rota para validar período (opcional)
router.post("/validate-period", (req: Request, res: Response): void => {
  try {
    const { startDate, endDate }: { startDate: string; endDate: string } =
      req.body;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: "Datas são obrigatórias",
      });
      return;
    }

    if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
      res.status(400).json({
        success: false,
        error: "Formato de data inválido",
      });
      return;
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (start > end) {
      res.status(400).json({
        success: false,
        error: "Data inicial deve ser menor que a final",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        isValid: true,
        monthsCount: Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao validar período",
    });
  }
});

export default router;
