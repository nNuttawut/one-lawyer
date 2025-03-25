
export function currencyFormat(amount) {
    if (amount) {
        return Number(amount)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
        return "-";
    }
}
export function currencyFormatOne(amount) {
    if (amount) {
        return Number(amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    } else {
        return "-"
    }
}
export function msDue(api, placement) {
    api.error({
        message: "error",
        description:
            'ไม่พบข้อมูลตารางดิว',
        placement,
    });
};
export function msConnt(api, placement) {
    api.error({
        message: "error",
        description:
            'ไม่พบข้อมูลสัญญานี้ กรุณาตรวจสอบเลขที่สัญญา ว่าถูกต้องหรือไม่ ?',
        placement,
    });
};
export function msData(api, placement) {
    api.warning({
        message: "คำเตือน",
        description:
            'ไม่พบข้อมูล',
        placement,
    });
};
export function msCancel(api, placement) {
    api.success({
        message: "ยกเลิก",
        description:
            'ยกเลิกทำรายการสำเร็จ',
        placement,
    });
};
export function msOK(api, placement) {
    api.success({
        message: "สำเร็จ",
        description:
            'ทำรายการสำเร็จ',
        placement,
    });
};
export function msOKMemo1(api, placement) {
    api.success({
        message: "สำเร็จ",
        description:
            'บันทึกโน๊ตสำเร็จ',
        placement,
    });
};
export function msErrorInst(api, placement) {
    api.error({
        message: "error",
        description:
            'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
        placement,
    });
};
export function msError(api, placement) {
    api.error({
        message: "error",
        description:
            'เกิดข้อผิดพลาด กรุณาติดต่อไอที',
        placement,
    });
};
export function msReceipt(api, placement) {
    api.warning({
        message: "คำเตือน",
        description:
            'กรุณากรอกข้อมูลให้ถูกต้อง !',
        placement,
    });
};
export function msLoad(api, placement) {
    api.warning({
        message: "คำเตือน",
        description:
            'การโหลดข้อมูลมีปัญหา กรุณาออกเข้าใหม่อีกครั้ง !',
        placement,
    });
};