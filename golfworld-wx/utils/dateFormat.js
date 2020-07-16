import fecha from './fecha';


function toDate(dateStr, formatStr) {
    var dateArray = toDateArray(dateStr)
    if (dateArray.length == 0) return ''
    return fecha.format(new Date(dateArray[0], dateArray[1], dateArray[2]), formatStr)
}

function toDateArray(date) {
    if (date == undefined && dete == '') return ''
    var array = date.split('-')
    return array
}


module.exports = {
    toDate: toDate,
};
