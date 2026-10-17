import './Footer.css';

const columns = [
  { title: 'Shop', items: ['Women', 'Men', 'New arrivals', 'Sale'] },
  { title: 'Help', items: ['Shipping', 'Returns', 'Size guide', 'Contact'] },
  { title: 'Company', items: ['Our story', 'Import & export', 'Careers', 'Press'] },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__name">Vandelay Industries</div>
          <p className="footer__claim">Importers and exporters of fine apparel since 1990.</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <div className="footer__title">{column.title}</div>
            <ul className="footer__list">
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        © 2026 Vandelay Industries · Demo shop for the AI Search PoC
      </div>
    </footer>
  );
}
