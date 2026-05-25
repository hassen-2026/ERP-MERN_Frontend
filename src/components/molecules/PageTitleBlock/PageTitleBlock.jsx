import Typography from "../../atoms/Typography/Typography";
import { PAGE_TITLE_BLOCK_DEFAULTS } from "../defaults/pageTitleBlock_default";

function PageTitleBlock(props) {
  const {
    title,
    subtitle,
    containerClassName,
    titleClassName,
    subtitleClassName,
  } = {
    ...PAGE_TITLE_BLOCK_DEFAULTS,
    ...props,
  };

  return (
    <div className={containerClassName}>
      <Typography variant="title" level={2} className={titleClassName}>
        {title}
      </Typography>
      <Typography variant="paragraph" className={subtitleClassName}>
        {subtitle}
      </Typography>
    </div>
  );
}

export default PageTitleBlock;
