function sqr(x) {
    return x*x;
}

function sqrt(x) {
    return Math.sqrt(Math.abs(x));
}

function sqrt(x) {
    return Math.sqrt(Math.abs(x));
}

function log10(val) {
    return Math.log(val) / Math.LN10;
}

function sign(x) {
    return (x > 0 ? 1 : (x < 0 ? -1 : 0));
}

function rand(x) {
    return (Math.random() * x);
}

function bnot(x) {
    return (x == 0 ? 1 : 0);
}

function pow(x, y) {
    var z = Math.pow(x,y);
    if(isNaN(z))  {
        return 0;
    }
    return z;
}

function div(x, y) {
    var z = x / y;
    if(!isFinite(z))  {
        return 0;
    }
    return z;
}

function mod(x, y) {
    var z = Math.floor(x) % Math.floor(y);
    if(isNaN(z))  {
        return 0;
    }
    return z;
}

function bitor(x, y) {
    var z = Math.floor(x) | Math.floor(y);
    if(isNaN(z))  {
        return 0;
    }
    return z;
}

function bitand(x, y) {
    var z = Math.floor(x) & Math.floor(y);
    if(isNaN(z))  {
        return 0;
    }
    return z;
}

function sigmoid(x, y) {
    var t = 1 + Math.exp(-x * y);
    return (Math.abs(t) > 0.00001) ? 1.0 / t : 0;
}

function bor(x, y) {
    return (x != 0 || y != 0) ? 1 : 0;
}

function band(x, y) {
    return (x != 0 && y != 0) ? 1 : 0;
}

function equal(x, y) {
    return (Math.abs(x - y) < 0.00001) ? 1 : 0;
}

function above(x, y) {
    return (x > y) ? 1 : 0;
}

function below(x, y) {
    return (x < y) ? 1 : 0;
}

function ifcond(x, y, z) {
    return (x != 0) ? y : z;
}
