const htmlInput = document.getElementById("html-input");
const jsonOutput = document.getElementById("json-output");

const parseHTML = (input) => {
  let regex = /<(\/?)([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*(\/?)>|([^<]+)/g;
  let stack = [];
  let root = { nodeName: "#document", childNodes: [] };
  let currentNode = root;

  input.replace(
    regex,
    (match, closing, tagName, attrs, selfClosing, text, index) => {
      if (text) {
        text = text.trim();
        if (text.length > 0) {
          currentNode.childNodes.push({ nodeName: "#text", nodeValue: text });
        }
      } else {
        if (closing) {
          if (
            stack.length > 0 &&
            stack[stack.length - 1].nodeName === tagName
          ) {
            currentNode = stack.pop();
          }
        } else {
          let node = {
            nodeName: tagName,
            attributes: {},
            childNodes: [],
          };

          if (attrs) {
            attrs
              .trim()
              .replace(/([\w-]+)="([^"]*)"/g, (_, attrName, attrValue) => {
                node.attributes[attrName] = attrValue;
              });
          }

          currentNode.childNodes.push(node);

          if (!selfClosing) {
            stack.push(currentNode);
            currentNode = node;
          } else if (stack.length > 0) {
            currentNode = stack.pop();
          }
        }
      }
    }
  );

  return root.childNodes.filter(
    (node) => node.nodeName !== "#text" || node.nodeValue.trim().length > 0
  );
};

htmlInput.addEventListener("input", () => {
  const parsedDOM = parseHTML(htmlInput.value);
  jsonOutput.value = JSON.stringify(parsedDOM, null, 2);
});
