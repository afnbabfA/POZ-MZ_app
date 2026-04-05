export const analyzePesel = (pesel) => {
    if (!pesel || typeof pesel !== 'string' || pesel.length !== 11 || !/^\d+$/.test(pesel)) return null;
    let year = parseInt(pesel.substring(0, 2), 10);
    let month = parseInt(pesel.substring(2, 4), 10);
    let day = parseInt(pesel.substring(4, 6), 10);
    
    if (month >= 1 && month <= 12) year += 1900;
    else if (month >= 21 && month <= 32) { year += 2000; month -= 20; }
    else if (month >= 81 && month <= 92) { year += 1800; month -= 80; }
    else return null;

    const dob = new Date(year, month - 1, day);
    const today = new Date();
    let computedAge = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        computedAge--;
    }
    
    const genderDigit = parseInt(pesel.substring(9, 10), 10);
    const computedGender = genderDigit % 2 === 0 ? 'F' : 'M';
    
    return { age: computedAge, gender: computedGender };
};
