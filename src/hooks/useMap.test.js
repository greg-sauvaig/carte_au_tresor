import { renderHook, act } from '@testing-library/react-hooks'
import useMap from "./useMap";
import board from "../stubs/board";

describe('useMap (hook)', () => {

    it('should return the current map', async () => {
        const file = "C - 4 - 4\r\nM​ - 1 - 0\r\n# toto ete\r\nM​ - 2 - 1\r\nT​ - 0 - 3 - 2\r\nT​ - 1 - 3 - 3\r\nA​ - Lara - 1 - 1 - S - AADADAGGA\r\n";
        const { result } = renderHook(() => useMap());
        act(() => {
          result.current.parseFileLoadMap(file);
        });
        const map = await result.current.map;
        expect(map).toEqual(board);
    });
});

