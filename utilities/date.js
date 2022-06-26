// Get's the day, week and month.
exports.getEdDate = function() {
    const today = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    return today.toLocaleDateString('en-US', options);
};

// Get's the day, week, month and year.
exports.getEdDateWithYear = function() {
    const today = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
   };
 
    return today.toLocaleDateString('en-US', options); 
}; 

// Get's the day of the week.
exports.getEdWeekDay = function() {
    const today = new Date();
    const options = {
        weekday: 'long'
    };
 
    return today.toLocaleDateString('en-US', options);
}; 

// Get's the numerical day of the week.
exports.getEdDayNumeric = function() {
    const today = new Date();
    const options = {
        day: 'numeric',
    };
 
    return today.toLocaleDateString('en-US', options);
}; 

// Get's the month.
exports.getEdMonth = function() {
    const today = new Date();
    const options = {
        month: 'long'
    };
 
    return today.toLocaleDateString('en-US', options);
}; 

// Get's the numerical month.
exports.getEdMonthNumeric = function() {
    const today = new Date();
    const options = {
        month: 'numeric'
    };
 
    return today.toLocaleDateString('en-US', options);
}; 

// Get's the year.
exports.getEdYear = function() {
    const today = new Date();
    const options = {
        year: 'numeric'
    };
 
    return today.toLocaleDateString('en-US', options);
}; 

exports.getAge = function(dateString) 
{
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
};

