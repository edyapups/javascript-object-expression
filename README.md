# javascript-object-expression
Реализация вычисления выражения с помощью объектов JavaScript

### Домашнее задание 7\. Объектные выражения на JavaScript

1.  Разработайте классы `Const`, `Variable`, `Add`, `Subtract`, `Multiply`, `Divide`, `Negate` для представления выражений с одной переменной.
    1.  Пример описания выражения `2x-3`:

        <pre>let expr = new Subtract(
            new Multiply(
                new Const(2),
                new Variable("x")
            ),
            new Const(3)
        );</pre>

    2.  Метод `evaluate(x)` должен производить вычисления вида: При вычислении такого выражения вместо каждой переменной подставляется значение `x`, переданное в качестве параметра функции `evaluate` (на данном этапе имена переменных игнорируются). Таким образом, результатом вычисления приведенного примера должно стать число 7.
    3.  Метод `toString()` должен выдавать запись выражения в [обратной польской записи](http://ru.wikipedia.org/wiki/%D0%9E%D0%B1%D1%80%D0%B0%D1%82%D0%BD%D0%B0%D1%8F_%D0%BF%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D1%8F_%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C). Например, `expr.toString()` должен выдавать `2 x * 3 -`.
2.  **Сложный вариант.**

    Метод `diff("x")` должен возвращать выражение, представляющее производную исходного выражения по переменной `x`. Например, `expr.diff("x")` должен возвращать выражение, эквивалентное `new Const(2)` (выражения `new Subtract(new Const(2), new Const(0))` и

    <pre>new Subtract(
        new Add(
            new Multiply(new Const(0), new Variable("x")),
            new Multiply(new Const(2), new Const(1))
        )
        new Const(0)
    ) </pre>

    так же будут считаться правильным ответом).

    Функция `parse` должна выдавать разобранное объектное выражение.

* *Gauss*. Дополнительно реализовать поддержку:
    * функций:
        * `Gauss` (`gauss`) – [функция Гаусса](https://ru.wikipedia.org/wiki/%D0%93%D0%B0%D1%83%D1%81%D1%81%D0%BE%D0%B2%D0%B0_%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F);
          от четырех аргументов: `a`, `b`, `c`, `x`.
