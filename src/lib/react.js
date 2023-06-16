/**
 * Creates a span with the supplied children.
 * @param {...React.ReactElement} children
 * @returns {React.ReactElement} 
 */
export function WrapperSpan(...children) {
  return React.createElement(
    'span',
    null,
    ...children,
  );
}

/**
 * Returns a React element
 * @param {string} text
 * @param {{
 *  color: string?,
 *  background: string?,
 *  bold: bool?,
 *  italic: bool?,
 * }} style
 * @returns {React.ReactElement} 
 */
export function StyledText(text, style) {
  return React.createElement(
    'span',
    {
      style: {
        color: style.color,
        backgroundColor: style.background,
        fontWeight: style.bold ? 'bold' : 'normal',
        fontStyle: style.italic ? 'italic' : 'normal',
      }
    },
    text,
  );
}

/**
 * Returns the props of an element
 * @param {Element} element
 * @returns {object}
 */
export function getProps(element) {
  const key = Object.keys(element).find(k => k.startsWith('__reactProps$'));
  return element[key];
}
