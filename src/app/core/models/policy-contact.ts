export class PolicyContact {
    constructor(
        public Id: number,
        public CountryCode: string,
        public Phone: string,
        public PhoneExtention: string | null
    ) { }
}
