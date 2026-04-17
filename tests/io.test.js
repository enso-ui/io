import { describe, expect, it, vi } from 'vitest';

vi.mock('@enso-ui/enums/src/pinia/enums', () => ({
    enums: () => ({
        enums: {
            ioTypes: {
                _get: value => value,
            },
            ioStatuses: {
                Started: 'started',
                Finalized: 'finalized',
            },
        },
    }),
}));

vi.mock('@enso-ui/ui/src/pinia/app', () => ({
    app: () => ({
        user: { id: 1 },
        meta: { csrfToken: 'csrf' },
    }),
}));

vi.mock('@enso-ui/ui/src/pinia/websockets', () => ({
    websockets: () => ({
        channels: { io: 'io-channel' },
        connect: vi.fn().mockResolvedValue(),
    }),
}));

vi.mock('@enso-ui/ui/src/modules/plugins/date-fns/formatDistance', () => ({
    default: value => value,
}));

import IO from '../src/core/components/navbar/IO.vue';
import Operation from '../src/core/components/navbar/io/Operation.vue';

describe('io state access', () => {
    it('uses enum store directly in IO component', () => {
        expect(IO.computed.enums.call({}).ioStatuses.Started).toBe('started');
    });

    it('uses enum store directly in operation component', () => {
        expect(Operation.computed.enums.call({}).ioTypes._get('import')).toBe('import');
    });
});
