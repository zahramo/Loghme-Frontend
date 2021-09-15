const Converter = (englishNumber) => {
    const convertEnglishCharToPersian = (char) => {
        return (char === "1") ? "۱" :
            (char === "2") ? "۲" :
            (char === "0") ? "۰" :
                (char === "3") ? "۳" :
                    (char === "4") ? "۴" :
                        (char === "5") ? "۵" :
                            (char === "6") ? "۶" :
                                (char === "7") ? "۷" :
                                    (char === "8") ? "۸" :
                                        (char === "9") ? "۹" : char;
    }

    const englishNum = englishNumber.toString();
    let persianNum = "";
    let i;
    for (i = 0; i < englishNum.length; i++) {
        persianNum += convertEnglishCharToPersian(englishNum[i]);
    }
    return persianNum;
};

export default Converter;