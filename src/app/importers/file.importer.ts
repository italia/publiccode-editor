import yamlSerializer from "../yaml-serializer";

export default (file: File) => yamlSerializer(file.stream());