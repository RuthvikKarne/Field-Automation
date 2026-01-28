export default function StatsCard({ title, value, icon, color, onClick }) {
    return (
        <div
            className="stats-card"
            style={{ borderLeftColor: color }}
            onClick={onClick}
        >
            <div className="stats-content">
                <div className="stats-text">
                    <p className="stats-title">{title}</p>
                    <h3 className="stats-value">{value}</h3>
                </div>
                <div className="stats-icon" style={{ color }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
