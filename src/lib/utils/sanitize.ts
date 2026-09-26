/**
 * Simple HTML sanitizer that only allows known-safe tags and attributes.
 * Strips script, iframe, object, embed, and event handler attributes.
 */
export function sanitizeHtml(html: string): string {
  return html
    // Remove script tags and content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    // Remove iframe tags
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<iframe[\s\S]*?\/?>/gi, "")
    // Remove object/embed tags
    .replace(/<(object|embed)[\s\S]*?>/gi, "")
    // Remove event handlers (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "")
    // Remove javascript: URLs
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    // Remove data: URLs in src attributes
    .replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""')
    // Remove form tags
    .replace(/<(form|input|button|textarea|select)[\s\S]*?>/gi, "")
    .replace(/<\/(form|input|button|textarea|select)>/gi, "")
    // Remove style tags
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}
