import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAppMode,
  getUserAuthDetails,
  getUserPersonaSurveyDetails,
} from "store/selectors";
import { RQButton, RQModal } from "lib/design-system/components";
import { SurveyModalFooter } from "./ModalFooter";
import { SurveyConfig, OptionsConfig } from "./config";
import { isExtensionInstalled } from "actions/ExtensionActions";
import { shouldShowPersonaSurvey, shuffleOptions } from "./utils";
import { Conditional, Option, PageConfig } from "./types";
import {
  trackPersonaSurveyViewed,
  trackPersonaRecommendationSkipped,
  trackPersonaSurveySignInClicked,
} from "modules/analytics/events/misc/personaSurvey";
//@ts-ignore
import { CONSTANTS as GLOBAL_CONSTANTS } from "@requestly/requestly-core";
import APP_CONSTANTS from "config/constants";
import { AUTH } from "modules/analytics/events/common/constants";
import { actions } from "store";
import "./index.css";
import { SurveyOption } from "./Option";

interface PersonaModalProps {
  isOpen: boolean;
  toggle: () => void;
  toggleImportRulesModal: () => void;
}

export const PersonaSurveyModal: React.FC<PersonaModalProps> = ({
  isOpen,
  toggle,
  toggleImportRulesModal,
}) => {
  const dispatch = useDispatch();
  const appMode = useSelector(getAppMode);
  const user = useSelector(getUserAuthDetails);
  const userPersona = useSelector(getUserPersonaSurveyDetails);
  const currentPage = userPersona.page;
  const persona = userPersona.persona;

  const shuffledPersonas = useMemo(() => {
    return shuffleOptions(OptionsConfig[1].options);
  }, []);

  const shuffledUseCases = useMemo(() => {
    if (persona) {
      const { conditional } = OptionsConfig[2];
      const { options } = conditional.find((option: Conditional) =>
        option.condition(persona)
      );
      const otherOption = options.pop();
      const shuffled = shuffleOptions(options);
      //others options to remain at last always
      return [...shuffled, otherOption];
    }
    return null;
  }, [persona]);

  const shuffledReferrals = useMemo(() => {
    return shuffleOptions(OptionsConfig[3].options);
  }, []);

  const SkippableButton = () => {
    switch (currentPage) {
      case 0:
        return (
          <div className="skip-recommendation-wrapper">
            Existing user?
            <RQButton
              className="skip-recommendation-btn persona-login-btn"
              type="link"
              onClick={() => {
                trackPersonaSurveySignInClicked();
                dispatch(
                  actions.toggleActiveModal({
                    modalName: "authModal",
                    newProps: {
                      callback: () => {
                        toggle();
                        dispatch(actions.updateIsPersonaSurveyCompleted(true));
                      },
                      authMode: APP_CONSTANTS.AUTH.ACTION_LABELS.LOG_IN,
                      eventSource: AUTH.SOURCE.PERSONA_SURVEY,
                    },
                  })
                );
              }}
            >
              Sign in
            </RQButton>
          </div>
        );

      case SurveyConfig.length - 1:
        return (
          <div className="skip-recommendation-wrapper">
            <RQButton
              type="link"
              onClick={() => {
                toggle();
                dispatch(actions.updateIsPersonaSurveyCompleted(true));
                trackPersonaRecommendationSkipped();
              }}
              className="white skip-recommendation-btn"
            >
              Skip
            </RQButton>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPageHeader = (page: PageConfig) => {
    return (
      <>
        <SkippableButton />
        <div className="text-center white text-bold survey-title">
          {page.title}
        </div>
        <div className="w-full survey-subtitle-wrapper">
          <div className="text-gray text-center survey-sub-title">
            {page.subTitle}
          </div>
        </div>
      </>
    );
  };

  const renderQuestionnaire = (optionSet: number) => {
    switch (optionSet) {
      case 1:
        return renderOptions(shuffledPersonas, optionSet);
      case 2:
        return renderOptions(shuffledUseCases, optionSet);
      case 3:
        return renderOptions(shuffledReferrals, optionSet);
      default:
        return null;
    }
  };
  const renderOptions = (options: Option[], optionSet: number) => {
    return (
      <>
        <div className="survey-options-container">
          {options.map((option: Option, index: number) => (
            <SurveyOption
              key={index}
              option={option}
              questionType={OptionsConfig[optionSet].questionType}
              isActive={OptionsConfig[optionSet].isActive}
              action={OptionsConfig[optionSet].action}
              fieldKey={OptionsConfig[optionSet].key}
            />
          ))}
        </div>
      </>
    );
  };

  const renderPage = (page: PageConfig, persona: string) => {
    return (
      <>
        {renderPageHeader(page)}
        <>
          {typeof page.render === "function"
            ? page.render({ toggleImportRulesModal })
            : renderQuestionnaire(page.render)}
        </>
      </>
    );
  };

  useEffect(() => {
    shouldShowPersonaSurvey(appMode).then((result) => {
      if (result) {
        if (appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP) {
          toggle();
          trackPersonaSurveyViewed();
        } else {
          if (isExtensionInstalled()) {
            toggle();
            trackPersonaSurveyViewed();
          }
        }
      }
    });
  }, [appMode, user.loggedIn, toggle]);

  return (
    <RQModal
      bodyStyle={{ width: "550px" }}
      centered
      open={isOpen}
      closable={false}
      className="survey-modal"
      maskStyle={{ background: "#0d0d10" }}
    >
      <div
        className={`rq-modal-content survey-content-wrapper ${
          currentPage === SurveyConfig.length - 1 &&
          "survey-modal-border-radius"
        }`}
      >
        {SurveyConfig.map((page: PageConfig, index) => (
          <React.Fragment key={index}>
            {currentPage === page.pageId && <>{renderPage(page, persona)}</>}
          </React.Fragment>
        ))}
      </div>
      <SurveyModalFooter page={currentPage} />
    </RQModal>
  );
};
