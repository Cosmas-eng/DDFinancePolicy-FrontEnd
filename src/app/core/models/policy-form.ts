export class PolicyForm {
    constructor(
        public PolicyName: string,
        public HolderId: number,
        public FirstName: string,
        public LastName: string,
        public OtherNames: string,
        public CountryCode: string,
        public Phone: string,
        public PhoneExtention: string,
        public Premium: Number,
        public StartDate: Date,
    ) { }
}
