import img_close from "../../asset/img/close.svg";

interface Props {
  onClick: () => void
}

const CloseButton = ({onClick}: Props) => 
      <div
        className="close__button"
        onClick={onClick}
      >
        <img src={img_close} />
      </div>

export default CloseButton;
