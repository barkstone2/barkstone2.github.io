const highlightRegex = /==([^=\s]+[^=]*[^=\s]+|[^=\s]+=[^=\s]+|[^=\s]+)==/g;
const parseObsidian = (markdown) => {
  markdown = markdown.replace(highlightRegex, '<mark>$1</mark>')
  return markdown;
}

export default parseObsidian