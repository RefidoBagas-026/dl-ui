class ErrorHelper {
  /**
   * Parse an error object (possibly nested arrays/objects) and return a single
   * string with each message on its own line prefixed by "- ".
   * Safe for strings, arrays, nested objects.
   */
  static parse(error) {
    const messages = [];

    function walk(node) {
      if (node == null) return;
      if (typeof node === "string") {
        messages.push(node);
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node === "object") {
        Object.keys(node).forEach((k) => walk(node[k]));
        return;
      }
      // fallback for primitives
      messages.push(String(node));
    }

    walk(error);

    if (messages.length === 0) return "";
    return messages.map((m) => `- ${m}`).join("\n");
  }
}

export default ErrorHelper;