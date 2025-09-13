// File: pages/payment/Cancel.jsx

const Cancel = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Վճարումը չեղարկվեց ❌</h1>
            <p className="text-lg text-red-800">
                Եթե ցանկանում եք կրկին փորձել վճարել, վերադառնացե՛ք զամբյուղ և կրկնեք գործընթացը։
            </p>
        </div>
    );
};

export default Cancel;
