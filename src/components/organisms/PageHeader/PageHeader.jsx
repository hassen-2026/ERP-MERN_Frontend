import PageTitleBlock from "../../molecules/PageTitleBlock/PageTitleBlock";
import ActionButtonsGroup from "../../molecules/ActionButtonsGroup/ActionButtonsGroup";
import { PAGE_HEADER_DEFAULTS } from "../defaults/pageHeader_default";
import "./PageHeader.css";

function PageHeader(props) {
  const {
    title,
    subtitle,
    actions,
    containerClassName,
    titleBlockClassName,
    titleClassName,
    subtitleClassName,
    actionsClassName,
    defaultActionVariant,
  } = {
    ...PAGE_HEADER_DEFAULTS,
    ...props,
  };

  return (
    <header className={containerClassName}>
      <PageTitleBlock
        title={title}
        subtitle={subtitle}
        containerClassName={titleBlockClassName}
        titleClassName={titleClassName}
        subtitleClassName={subtitleClassName}
      />
      <ActionButtonsGroup
        actions={actions}
        containerClassName={actionsClassName}
        buttonVariant={defaultActionVariant}
      />
    </header>
  );
}

export default PageHeader;
