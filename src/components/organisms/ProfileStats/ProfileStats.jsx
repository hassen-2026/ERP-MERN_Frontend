import StatCard from "../../molecules/StatCard/StatCard";
import "./ProfileStats.css";

function ProfileStats(props) {
  const {
    stats,
    customClassName,
    containerClassName,
  } = {
    stats: [
      { label: "Commandes", value: "0" },
      { label: "Montant Total", value: "$0" },
      { label: "Depuis", value: "N/A" },
    ],
    customClassName: "",
    containerClassName: "m-profile-stats__container",
    ...props,
  };

  return (
    <div className={`m-profile-stats ${customClassName}`.trim()}>
      <div className={containerClassName}>
        {stats.map((stat, idx) => (
          <StatCard
            key={`stat-${idx}`}
            label={stat.label}
            value={stat.value}
            containerClassName="m-profile-stats__card"
          />
        ))}
      </div>
    </div>
  );
}

export default ProfileStats;
