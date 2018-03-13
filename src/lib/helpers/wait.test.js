import wait from './wait';


describe('wait', function () {
    const text = 'hello',
        time = 10000;

    it('should shoud resolve after param1 with param2', async () => {
        jest.useFakeTimers();
        const waitpre = wait(time,text);
        jest.runAllTimers();
        const waited = await waitpre;
        expect(waited).toBe(text);

    });

    it('should shoud reject after param1 with param2 if param3 0 fail', async () => {
        jest.useFakeTimers();
        try{
            wait(time,text,'fail');
            jest.runAllTimers();
        }catch (e){
            expect(e).toBe(text);
        }
    });


});