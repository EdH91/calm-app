import { icon } from '../icons.js';

export function bottomNav(active) {
  const items = [
    { key: 'home', href: '#/home', label: 'Home', icon: icon.home },
    { key: 'rewards', href: '#/rewards', label: 'Rewards', icon: icon.leaf },
    { key: 'parent', href: '#/parent', label: 'Parent', icon: icon.shield }
  ];
  return `
    <div class="bottom-nav">
      ${items
        .map(
          (item) => `
        <a href="${item.href}" class="${item.key === active ? 'active' : ''}">
          ${item.icon}
          <span>${item.label}</span>
        </a>`
        )
        .join('')}
    </div>
  `;
}
