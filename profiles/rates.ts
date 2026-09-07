const ADMISSION_BALANCE = 0; // 只要不欠钱就给进
// 费率均为分钱每分钟
const CIRCADY_RATES = [
    {   // 日首平价
        startMinute: 0,
        endMinute: 240,
        maxout: null,
        rate: 25,
        globalDiscountApply: true,
    },
    {   // 舞萌维护期+早鸟激励
        startMinute: 240,
        endMinute: 600,
        maxout: null,
        rate: 10,
        globalDiscountApply: false,
    },
    {   // 白天4小时封顶
        startMinute: 600,
        endMinute: 1320,
        maxout: 240,
        rate: 25,
        globalDiscountApply: true,
    },
    {   // 黄金两小时
        startMinute: 1320,
        endMinute: 1440,
        maxout: null,
        rate: 30,
        globalDiscountApply: true,
    }
]

const GLOBAL_DISCOUNT = 0.7;

export { CIRCADY_RATES, GLOBAL_DISCOUNT, ADMISSION_BALANCE };
