import mimeDb from "mime-db";

export default Object.keys(mimeDb).map((o) => ({ text: o, value: o }));
