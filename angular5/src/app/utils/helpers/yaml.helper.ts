
declare function require(path: string): any;

const YAML: any = require('yamljs');

export class YamlHelper {

    public static readonly Load = <T>(path: string) => YAML.load(path) as T;

    public static readonly Parse = <T>(yamlString: string) => YAML.parse(yamlString) as T;

    public static readonly ToYaml = (obj: any): string => YAML.stringify(obj, 4) as string;

}
