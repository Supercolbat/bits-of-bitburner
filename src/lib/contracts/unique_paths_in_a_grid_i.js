/** @param {[number, number]} data */
export function unique_paths_in_a_grid_i(data) {
  const [width, height] = data;

  return (width * (width + 1)) / 2;
  /*
  0 . . .   0 . . .   0 . . .   0 . . .
  0 . . .   x 0 . .   x x 0 .   x x x 0 ->
  x x x @   . x x @   . . x @   . . . @

  x 0 . .   x 0 . .   x 0 . . ->
  . 0 . .   . . 0 .   . . . 0 --->
  . x x @   . . x @   . . . x

  x x 0 .   x x 0 . ->
  . . 0 .   . . x 0 --->
  . . x @   . . . @

  x x x 0 ->
  . . . 0 --->
  . . . @

  ===

  0 . .   0 . .   0 . .
  0 . .   0 . .   0 . .
  0 . .   x 0 .   x x 0 ->
  x x @   . x @   . . @

  0 . .   0 . .
  x 0 .   x 0 . ->
  . 0 .   . x 0 --->
  . x @   . . @

  0 . .
  x x 0
  . . 0
  . . @

  x 0 .   x 0 .
  . 0 .   . 0 .
  . 0 .   . x 0
  . x @   . . @

  x 0 .
  . x 0
  . . 0
  . . @

  x x 0
  . . 0
  . . 0
  . . @

  ===

  0 . .   0 . .   0 . .
  0 . .   x 0 .   x x 0
  x x @   . x 0   . . 0

  x 0 .   x 0 .
  . 0 .   . x 0
  . x @   . . @

  x x 0
  . . 0
  . . 0

  ===

  0 . . . .   x 0 . . .   x x 0 . .   x x x 0 .   x x x x 0
  x x x x @   . x x x @   . . x x @   . . . x @   . . . . @
  */
}