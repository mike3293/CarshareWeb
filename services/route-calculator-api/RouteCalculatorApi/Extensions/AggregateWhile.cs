using System;
using System.Collections.Generic;

namespace RouteCalculatorApi.Extensions;

public static class AggregateWhileExtension
{
    public static TAccumulate AggregateWhile<TSource, TAccumulate>(
        this IEnumerable<TSource> source,
        TAccumulate seed,
        Func<TAccumulate, TSource, TAccumulate> func,
        Func<TAccumulate, bool> predicate,
        Func<TAccumulate, TSource, TAccumulate> predicateLastItemProcessor)
    {
        if (source == null)
            throw new ArgumentNullException(nameof(source));

        if (func == null)
            throw new ArgumentNullException(nameof(func));

        if (predicate == null)
            throw new ArgumentNullException(nameof(predicate));

        var accumulate = seed;
        foreach (var item in source)
        {
            var tmp = func(accumulate, item);
            if (!predicate(tmp))
            {
                accumulate = predicateLastItemProcessor(accumulate, item);
                break;
            }
            accumulate = tmp;
        }

        return accumulate;
    }
}
