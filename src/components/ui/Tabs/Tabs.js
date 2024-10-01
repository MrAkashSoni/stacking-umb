import React, { useCallback, useState } from "react";
import { TabsContext } from "./TabsContext";

import "./tabs.scss";

function Tabs({ children, onActive }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeContent, setActiveContent] = useState();

  const getTabsContext = useCallback(
    (index) => {
      const activateTab = (nextIndex) => {
        setActiveIndex(nextIndex);

        if (onActive) {
          onActive(nextIndex);
        }
      };

      return {
        activeIndex,
        active: activeIndex === index,
        index,
        onActivate: () => activateTab(index),
        setActiveContent,
      };
    },
    [activeIndex, onActive]
  );

  const tabs = React.Children.map(children, (child, index) => (
    <TabsContext.Provider value={getTabsContext(index)}>
      {React.cloneElement(child, { active: activeIndex === index })}
    </TabsContext.Provider>
  ));

  return (
    <div className="tabs">
      <div className="tabs__header">{tabs}</div>
      <div className="tabs__content">{activeContent}</div>
    </div>
  );
}

export default Tabs;
