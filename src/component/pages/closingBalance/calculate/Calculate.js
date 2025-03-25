export const calPayAROTHR = async (value) => {
    // console.log("value", value) // ค่าที่กดคำนวณ
    let res = 0.00;
    await value.forEach((item) => {
        res += item.PAYAMT - item.SMPAY;
    });
    return res
}

export const calPayGRADE = async (grade, amt, GRDCAL) => {
    console.log(grade, amt, GRDCAL) // ค่าที่กดคำนวณ
    let res = 0.00;
    if (grade !== "" && amt > 0 && GRDCAL > 0) {
        res = amt * GRDCAL
    } else {
        console.log("else grade", grade)
    }
    // await value.forEach((item) => {
    //     res += item.PAYAMT - item.SMPAY;
    // });
    return res
}

export const calPayHD = async (value) => {
    // console.log("value", value) // ค่าที่กดคำนวณ
    let res = 0.00;
    if (value > 0) {
        res = value
    }
    return res
}