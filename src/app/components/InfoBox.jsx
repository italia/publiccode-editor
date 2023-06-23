import { useAppDispatch, useAppSelector } from "../store";
import { hide } from "../store/infobox";
import classNames from "classnames";
import CloseButton from "./CloseButton";

const InfoBox = () => {
  const dispatch = useAppDispatch();
  const { title, description, visible } = useAppSelector(
    (state) => state.infobox
  );
  const className = classNames(["info__box", { info__box__visible: visible }]);

  return (
    <div className={className}>
      <div className="info__box__body">
        <div className="info__box__close">
          <CloseButton
            href="#"
            className="link"
            onClick={() => dispatch(hide(description))}
          />
        </div>

        <div className="info__box__content">
          <p className="info__box__title">{title}</p>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
