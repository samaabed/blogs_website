const dateObjects = [
    { id: 3, date: 'December 15, 2017'},
    { id: 1, date: 'January 15, 2019'},
    { id: 2, date: 'February 15, 2011'}
];

// Sort the array based on the 'date' property
dateObjects.sort((a, b) => {
    let da = new Date(a.date),
        db = new Date(b.date);
    return db - da;
});

console.log(dateObjects);