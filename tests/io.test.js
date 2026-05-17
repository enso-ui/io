import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = path => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('composition api', () => {
    it('uses setup in headless components', () => {
        expect(source('../src/core/components/navbar/IO.vue')).toContain('setup(_, { slots })');
        expect(source('../src/core/components/navbar/io/Operation.vue'))
            .toContain('setup(props, { emit, slots })');
    });

    it('uses the enum store directly', () => {
        const io = source('../src/core/components/navbar/IO.vue');
        const operation = source('../src/core/components/navbar/io/Operation.vue');

        expect(io).toContain('enums().enums.ioStatuses.Started');
        expect(io).toContain('enums().enums.ioTypes._get');
        expect(operation).toContain('enums().enums.ioTypes');
        expect(`${io}\n${operation}`).not.toContain('computed:');
    });
});
