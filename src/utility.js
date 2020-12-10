const _ = {};

_.loop = (number, action) => {
    for(let i=0; i<number; i++) action(i)
};
