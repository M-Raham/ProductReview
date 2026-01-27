export const cleanMarkdown = (content: string) => {
  return content
    // Remove ** before HTML tags
    .replace(/\*\*<(h[1-6]|p|strong|em|ul|ol|li|blockquote)>/g, '<$1>')
    // Remove ** after HTML closing tags
    .replace(/<\/(h[1-6]|p|strong|em|ul|ol|li|blockquote)>\*\*/g, '</$1>')
    // Convert HTML headings to markdown
    .replace(/<h1>/g, '# ')
    .replace(/<\/h1>/g, '\n\n')
    .replace(/<h2>/g, '## ')
    .replace(/<\/h2>/g, '\n\n')
    .replace(/<h3>/g, '### ')
    .replace(/<\/h3>/g, '\n\n')
    // Convert HTML paragraphs
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    // Convert HTML strong/bold to markdown
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    // Convert HTML lists
    .replace(/<ul>/g, '\n')
    .replace(/<\/ul>/g, '\n')
    .replace(/<ol>/g, '\n')
    .replace(/<\/ol>/g, '\n')
    // Clean up list items
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '\n')
    // Convert blockquotes
    .replace(/<blockquote>/g, '\n> ')
    .replace(/<\/blockquote>/g, '\n\n')
    // Clean up any remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
