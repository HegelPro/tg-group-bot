import * as S from "fp-ts/State";
import { pipe } from "fp-ts/lib/function";

type Random<A> = S.State<A, number>;

const random: Random<number> = seed => {
  const nextSeed = (1839567234 * seed + 972348567) % 8239451023
  return [nextSeed, nextSeed];
}

const randomInRange: (max: number, min: number) => Random<number> =
  (max, min) => pipe(
    random,
    S.map((seed) => min + Math.floor((seed / 8239451023) * (max - min)))
  )

export const randomArrayElement =
  <A>(arr: A[]) => pipe(
    (randomInRange(arr.length - 1, 0)),
    S.map((randomIndex) => arr[randomIndex])
  )
