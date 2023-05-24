import { renderHook } from '@testing-library/react';
import ObjectSchema, { AnyObject, AssertsShape, TypeOfShape } from 'yup/lib/object';
import { Shape } from '../../../../../shared/yup/yup.schema';
import { UserFormData } from './../../../settings/redux/user/interfaces';
import { useUserSchema } from './../user-schema';

const validate = (
  schema: ObjectSchema<Shape<UserFormData>, AnyObject, TypeOfShape<Shape<UserFormData>>>,
  password?: string,
): Promise<AssertsShape<Shape<UserFormData>>> => schema.validateAt('password', { password });

describe('user validation schema', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should require password', async () => {
    const {
      result: { current: schema },
    } = renderHook(() => useUserSchema({} as UserFormData));

    await expect(validate(schema)).rejects.toBeTruthy();
    await expect(validate(schema, '')).rejects.toBeTruthy();
    await expect(validate(schema, '12345')).rejects.toBeTruthy();
    await expect(validate(schema, '123456789')).resolves.toEqual('123456789');
  });

  it('should not require password', async () => {
    const {
      result: { current: schema },
    } = renderHook(() => useUserSchema({ id: '1' } as UserFormData));
    await expect(validate(schema)).resolves.toBeUndefined();
    await expect(validate(schema, '')).resolves.toBeUndefined();
    await expect(validate(schema, '12345')).rejects.toBeTruthy();
    await expect(validate(schema, '123456789')).resolves.toEqual('123456789');
  });
});
