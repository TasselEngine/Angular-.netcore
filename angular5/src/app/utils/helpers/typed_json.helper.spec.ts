import { JsonHelper } from './typed_json.helper';

describe('test JsonHelper.ToJson', () => {
    it('should be ok', () => expect('{"a":123}').toBe(JsonHelper.ToJSON({ a: 123 })));
});
