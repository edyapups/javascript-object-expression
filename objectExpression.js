"use strict";

function Const(value) {
    this.value = value;
}

const TWO = new Const(2);
const ONE = new Const(1);
const ZERO = new Const(0);

function Variable(view) {
    this.view = view;
    this.position = view === "x" ? 0 : view === "y" ? 1 : 2;
}

const variableMap = {
    "x": new Variable("x"),
    "y": new Variable("y"),
    "z": new Variable("z")
};


function Operator(...args) {
    this.args = args;
}


function initiateObj(obj, evaluate, toString, diff) {
    obj.prototype.evaluate = evaluate;
    obj.prototype.toString = toString;
    obj.prototype.diff = diff;
}

initiateObj(Const,
    function () {
        return this.value;
    },
    function () {
        return this.value.toString();
    },
    function () {
        return ZERO;
    }
);

initiateObj(Variable,
    function (...args) {
        return args[this.position];
    },
    function () {
        return this.view;
    },
    function (view) {
        return this.view === view ? ONE : ZERO;
    }
);

initiateObj(Operator,
    function (...args) {
        return this._fun(...this.args.map(arg => arg.evaluate(...args)));
    },
    function () {
        return this.args.join(" ") + " " + this._name;
    },
    function (view) {
        return this._diff(view, ...this.args);
    }
);

function initOperator(op, fun, diff) {
    const Op = function (...args) {
        Operator.call(this, ...args);
    };
    Op.prototype = Object.create(Operator.prototype);
    Op.prototype.constructor = Op;
    Op.prototype._name = op;
    Op.prototype._fun = fun;
    Op.prototype._diff = diff;
    Op.prototype._length = fun.length;
    return Op;
}

const Add = initOperator("+",
    (a, b) => a + b,
    (view, a, b) => new Add(a.diff(view), b.diff(view)) 
);

const Subtract = initOperator("-",
    (a, b) => a - b,
    (view, a, b) => new Subtract(a.diff(view), b.diff(view))
);

const Multiply = initOperator("*",
    (a, b) => a * b,
    (view, a, b) => new Add(new Multiply(a.diff(view), b), new Multiply(a, b.diff(view)))
);

const Divide = initOperator("/",
    (a, b) => a / b,
    (view, a, b) => new Divide(
        new Subtract(
            new Multiply(a.diff(view), b),
            new Multiply(a, b.diff(view))
        ),
        new Multiply(b, b)
    )
);

const Negate = initOperator("negate",
    (a) => -a,
    (view, a) => new Negate(a.diff(view))
);

const Gauss = initOperator("gauss",
    (a, b, c, x) => a * Math.exp(-(x - b) * (x - b) / (2 * c * c)),
    (view, a, b, c, x) => {
        let dbl = new Subtract(x, b);
        return new Add(
            new Multiply(
                a.diff(view),
                new Gauss(ONE, b, c, x)
            ),
            new Multiply(
                a,
                new Multiply(
                    new Gauss(ONE, b, c, x),
                    Negate.prototype._diff(
                        view,
                        new Divide(
                            new Multiply(
                                // :NOTE: Дубли
                                dbl,
                                dbl
                            ),
                            new Multiply(
                                TWO,
                                new Multiply(c, c)
                            )
                        )
                    )
                )
            )
        )
    }
);

const parseMap = {
    "+": Add,
    "-": Subtract,
    "*": Multiply,
    "/": Divide,
    "negate": Negate,
    "gauss": Gauss
};

function parse(input) {
    let stack = [];
    for (let token of input.split(" ").filter(word => word.length > 0)) {
        if (token in parseMap) {
            const operation = parseMap[token];
            stack.push(new operation(...stack.splice(-operation.prototype._length)));
        } else if (token in variableMap) {
            stack.push(variableMap[token]);
        } else {
            stack.push(new Const(+token));
        }
    }
    return stack.pop();
}
