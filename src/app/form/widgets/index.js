import StringWidget from "./StringWidget";
import EmailWidget from "./EmailWidget";
import ArrayWidget from "./ArrayWidget";
import CheckboxWidget from "./CheckboxWidget";
import ObjectWidget from "./ObjectWidget";
import UrlWidget from "./UrlWidget";
import ChoiceWidget from "./ChoiceWidget";
import ChoiceExpandedWidget from "./ChoiceExpandedWidget";
import EditorWidget from "./EditorWidget";
import TagWidget from "./TagWidget";
import ComboBoxWidget from "./ComboBoxWidget";
import DateTimeReactWidget from "./DateTimeReactWidget";
import RemoteSearchWidget from "./RemoteSearchWidget";
import PhoneWidget from "./PhoneWidgets";
import HiddenWidget from "./HiddenWidget";

export default {
  editor: EditorWidget,
  tags: TagWidget,
  combobox: ComboBoxWidget,
  object: ObjectWidget,
  string: StringWidget,
  email: EmailWidget,
  array: ArrayWidget,
  boolean: CheckboxWidget,
  url: UrlWidget,
  choice: ChoiceWidget,
  "choice-expanded": ChoiceExpandedWidget,
  date: DateTimeReactWidget,
  phone: PhoneWidget,
  hidden: HiddenWidget,
  rsearch: RemoteSearchWidget
};
