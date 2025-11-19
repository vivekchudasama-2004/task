import React, { useState, useCallback, useMemo } from 'react';
import './App.css'; // External CSS Import

// --- Configuration & Constants ---
const CONSTANTS = {
    CURRENCIES: ['USD', 'EUR', 'GBP', 'INR'],
    PO_TYPES: { INDIVIDUAL: 'Individual', GROUP: 'Group' },
    REGEX: {
        EMAIL: /\S+@\S+\.\S+/,
        ALPHANUMERIC: /^[a-z0-9]+$/i
    }
};

// --- Mock Data Service ---
const MockService = {
    clients: [
        { id: 1, name: "TechSolutions Inc." },
        { id: 2, name: "Global Corp" },
        { id: 3, name: "StartUp Hub" }
    ],
    jobs: {
        "TechSolutions Inc.": [
            { title: "Senior React Dev", reqId: "REQ-2024-001" },
            { title: "UI/UX Designer", reqId: "REQ-2024-002" }
        ],
        "Global Corp": [
            { title: "Data Analyst", reqId: "REQ-GC-99" }
        ],
        "StartUp Hub": [
            { title: "Full Stack Engineer", reqId: "REQ-SH-55" },
            { title: "DevOps Specialist", reqId: "REQ-SH-56" }
        ]
    },
    talents: {
        "REQ-2024-001": [
            { id: 101, name: "Alice Johnson", email: "alice@test.com" },
            { id: 102, name: "Bob Smith", email: "bob@test.com" },
            { id: 103, name: "Charlie Brown", email: "charlie@test.com" }
        ],
        "REQ-2024-002": [
            { id: 201, name: "Diana Prince", email: "diana@test.com" }
        ],
        "REQ-GC-99": [
            { id: 301, name: "Evan Wright", email: "evan@test.com" },
            { id: 302, name: "Frank Castle", email: "frank@test.com" }
        ],
        "REQ-SH-55": [
            { id: 401, name: "Grace Hopper", email: "grace@test.com" }
        ],
        "REQ-SH-56": [
            { id: 501, name: "Henry Ford", email: "henry@test.com" }
        ]
    },
    getJobsByClient: (clientName) => MockService.jobs[clientName] || [],
    getTalentsByReq: (reqId) => MockService.talents[reqId] || []
};

// --- Assets (Icons) ---
const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
    Reset: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>,
    Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
};

// --- Custom Hook (Logic) ---
const usePOForm = () => {
    const initialFormState = {
        clientName: "",
        poType: "",
        poNumber: "",
        receivedOn: "",
        receivedFromName: "",
        receivedFromEmail: "",
        poStartDate: "",
        poEndDate: "",
        budget: "",
        currency: "USD"
    };

    const initialReqState = [{ id: Date.now(), jobTitle: "", reqId: "", selectedTalents: {} }];

    const [formData, setFormData] = useState(initialFormState);
    const [reqSections, setReqSections] = useState(initialReqState);
    const [errors, setErrors] = useState({});
    const [viewMode, setViewMode] = useState('EDIT');
    const [successMsg, setSuccessMsg] = useState("");

    const updateField = useCallback((name, value) => {
        if (name === 'budget' && value.length > 5) return;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'clientName') setReqSections(initialReqState);
            return updated;
        });
        setErrors(prev => ({ ...prev, [name]: null }));
    }, []);

    const updateReqSection = useCallback((sectionId, newData) => {
        setReqSections(prev => prev.map(sec => sec.id === sectionId ? { ...sec, ...newData } : sec));
    }, []);

    const addReqSection = useCallback(() => {
        setReqSections(prev => [...prev, { id: Date.now(), jobTitle: "", reqId: "", selectedTalents: {} }]);
    }, []);

    const removeReqSection = useCallback((id) => {
        setReqSections(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
    }, []);

    const resetForm = useCallback(() => {
        if (window.confirm("Are you sure you want to discard all changes?")) {
            setFormData(initialFormState);
            setReqSections(initialReqState);
            setErrors({});
            setSuccessMsg("");
            setViewMode('EDIT');
        }
    }, []);

    const validate = () => {
        const newErrors = {};
        const { clientName, poType, poNumber, receivedOn, receivedFromName, receivedFromEmail, poStartDate, poEndDate, budget } = formData;

        if (!clientName) newErrors.clientName = "Client Name is required";
        if (!poType) newErrors.poType = "PO Type is required";
        if (!receivedOn) newErrors.receivedOn = "Received Date is required";
        if (!receivedFromName) newErrors.receivedFromName = "Sender Name is required";
        if (!poStartDate) newErrors.poStartDate = "Start Date is required";
        if (!poEndDate) newErrors.poEndDate = "End Date is required";
        if (!budget) newErrors.budget = "Budget is required";

        if (!poNumber) {
            newErrors.poNumber = "PO Number is required";
        } else if (!CONSTANTS.REGEX.ALPHANUMERIC.test(poNumber)) {
            newErrors.poNumber = "Only alphanumeric characters allowed";
        }

        if (receivedFromEmail && !CONSTANTS.REGEX.EMAIL.test(receivedFromEmail)) {
            newErrors.receivedFromEmail = "Invalid email format";
        } else if (!receivedFromEmail) {
            newErrors.receivedFromEmail = "Email is required";
        }

        if (poStartDate && poEndDate && new Date(poEndDate) < new Date(poStartDate)) {
            newErrors.poEndDate = "End Date cannot be before Start Date";
        }

        let totalTalents = 0;
        let incompleteDetails = false;

        reqSections.forEach(sec => {
            if (!sec.jobTitle) newErrors[`jobTitle_${sec.id}`] = "Job Title is required";
            const talents = Object.values(sec.selectedTalents);
            totalTalents += talents.length;
            if (talents.some(t => !t.contractDuration || !t.billRate)) incompleteDetails = true;
        });

        if (incompleteDetails) {
            newErrors.general = "Please fill Contract Duration and Bill Rate for all selected talents.";
        } else if (poType === CONSTANTS.PO_TYPES.INDIVIDUAL && totalTalents !== 1) {
            newErrors.general = "Individual POs must have exactly one talent selected.";
        } else if (poType === CONSTANTS.PO_TYPES.GROUP && totalTalents < 2) {
            newErrors.general = "Group POs require at least two talents.";
        } else if (totalTalents === 0) {
            newErrors.general = "Please select at least one talent.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitForm = () => {
        if (validate()) {
            console.log("Submission Payload:", { ...formData, reqSections });
            setSuccessMsg("Purchase Order Created Successfully!");
            setViewMode('VIEW');
            window.scrollTo(0, 0);
        } else {
            setSuccessMsg("");
            window.scrollTo(0, 0);
        }
    };

    return { formData, reqSections, errors, viewMode, successMsg, actions: { updateField, updateReqSection, addReqSection, removeReqSection, resetForm, submitForm, setEditMode: () => setViewMode('EDIT') } };
};


// --- UI Components ---

const FormField = React.memo(({ label, error, children, required }) => (
    <div className="form-group">
        <label className="label">
            {label} {required && <span className="required">*</span>}
        </label>
        {children}
        {error && <span className="error-msg">{error}</span>}
    </div>
));

const PODetailsSection = React.memo(({ formData, onFieldChange, errors }) => (
    <section>
        <div className="section-title">
            <Icons.Briefcase />
            <h2>Purchase Order Details</h2>
        </div>

        <div className="form-grid">
            <FormField label="Client Name" error={errors.clientName} required>
                <select
                    name="clientName"
                    value={formData.clientName}
                    onChange={(e) => onFieldChange('clientName', e.target.value)}
                    className={`input-field ${errors.clientName ? 'input-error' : ''}`}
                >
                    <option value="">Select Client</option>
                    {MockService.clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </FormField>

            <FormField label="PO Type" error={errors.poType} required>
                <select
                    name="poType"
                    value={formData.poType}
                    onChange={(e) => onFieldChange('poType', e.target.value)}
                    className={`input-field ${errors.poType ? 'input-error' : ''}`}
                >
                    <option value="">Select Type</option>
                    <option value={CONSTANTS.PO_TYPES.INDIVIDUAL}>Individual PO</option>
                    <option value={CONSTANTS.PO_TYPES.GROUP}>Group PO</option>
                </select>
            </FormField>

            <FormField label="Purchase Order No." error={errors.poNumber} required>
                <input
                    type="text"
                    value={formData.poNumber}
                    onChange={(e) => onFieldChange('poNumber', e.target.value)}
                    placeholder="e.g. PO12345"
                    className={`input-field ${errors.poNumber ? 'input-error' : ''}`}
                />
            </FormField>

            <FormField label="Received On" error={errors.receivedOn} required>
                <input
                    type="date"
                    value={formData.receivedOn}
                    onChange={(e) => onFieldChange('receivedOn', e.target.value)}
                    className={`input-field ${errors.receivedOn ? 'input-error' : ''}`}
                />
            </FormField>

            <FormField label="Received From (Name)" error={errors.receivedFromName} required>
                <input
                    type="text"
                    value={formData.receivedFromName}
                    onChange={(e) => onFieldChange('receivedFromName', e.target.value)}
                    className={`input-field ${errors.receivedFromName ? 'input-error' : ''}`}
                />
            </FormField>

            <FormField label="Received From (Email)" error={errors.receivedFromEmail} required>
                <input
                    type="email"
                    value={formData.receivedFromEmail}
                    onChange={(e) => onFieldChange('receivedFromEmail', e.target.value)}
                    placeholder="email@example.com"
                    className={`input-field ${errors.receivedFromEmail ? 'input-error' : ''}`}
                />
            </FormField>

            <FormField label="PO Start Date" error={errors.poStartDate} required>
                <input
                    type="date"
                    value={formData.poStartDate}
                    onChange={(e) => onFieldChange('poStartDate', e.target.value)}
                    className={`input-field ${errors.poStartDate ? 'input-error' : ''}`}
                />
            </FormField>

            <FormField label="PO End Date" error={errors.poEndDate} required>
                <input
                    type="date"
                    value={formData.poEndDate}
                    onChange={(e) => onFieldChange('poEndDate', e.target.value)}
                    className={`input-field ${errors.poEndDate ? 'input-error' : ''}`}
                />
            </FormField>

            <FormField label="Budget" error={errors.budget} required>
                <div className="input-group">
                    <select
                        value={formData.currency}
                        onChange={(e) => onFieldChange('currency', e.target.value)}
                        className="input-field"
                    >
                        {CONSTANTS.CURRENCIES.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                    </select>
                    <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => onFieldChange('budget', e.target.value)}
                        placeholder="Max 5 digits"
                        className={`input-field ${errors.budget ? 'input-error' : ''}`}
                    />
                </div>
            </FormField>
        </div>
    </section>
));

const TalentRow = React.memo(({ talent, isSelected, currency, onToggle, onDetailChange }) => (
    <div className={`talent-row ${isSelected ? 'selected' : ''}`}>
        <div className="flex items-center gap-3 md:w-1/3">
            <input
                type="checkbox"
                id={`t_${talent.id}`}
                checked={isSelected}
                onChange={(e) => onToggle(talent.id, talent.name, e.target.checked)}
                style={{ width: '1.25rem', height: '1.25rem' }}
            />
            <label htmlFor={`t_${talent.id}`} style={{ cursor: 'pointer' }}>
                <span style={{ fontWeight: 500, display: 'block' }}>{talent.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{talent.email}</span>
            </label>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="Contract Duration"
                disabled={!isSelected}
                value={talent.details?.contractDuration || ""}
                onChange={(e) => onDetailChange(talent.id, 'contractDuration', e.target.value)}
                className="input-field"
            />
            <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.75rem', top: '0.5rem', fontSize: '0.875rem', color: isSelected ? '#6b7280' : '#d1d5db' }}>
          {currency}
        </span>
                <input
                    type="number"
                    placeholder="Bill Rate"
                    disabled={!isSelected}
                    value={talent.details?.billRate || ""}
                    onChange={(e) => onDetailChange(talent.id, 'billRate', e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '3rem' }}
                />
            </div>
        </div>
    </div>
));

const ReqSection = React.memo(({ sectionData, clientName, currency, error, canDelete, onUpdate, onDelete }) => {
    const availableJobs = useMemo(() => MockService.getJobsByClient(clientName), [clientName]);
    const availableTalents = useMemo(() => MockService.getTalentsByReq(sectionData.reqId), [sectionData.reqId]);

    const handleJobChange = useCallback((e) => {
        const newJobTitle = e.target.value;
        const jobInfo = availableJobs.find(j => j.title === newJobTitle);
        onUpdate(sectionData.id, { jobTitle: newJobTitle, reqId: jobInfo ? jobInfo.reqId : "", selectedTalents: {} });
    }, [availableJobs, onUpdate, sectionData.id]);

    const handleTalentToggle = useCallback((talentId, talentName, isChecked) => {
        const newSelected = { ...sectionData.selectedTalents };
        isChecked ? newSelected[talentId] = { name: talentName, contractDuration: "", billRate: "" } : delete newSelected[talentId];
        onUpdate(sectionData.id, { selectedTalents: newSelected });
    }, [sectionData.selectedTalents, sectionData.id, onUpdate]);

    const handleTalentDetail = useCallback((talentId, field, value) => {
        if (!sectionData.selectedTalents[talentId]) return;
        const newSelected = { ...sectionData.selectedTalents, [talentId]: { ...sectionData.selectedTalents[talentId], [field]: value } };
        onUpdate(sectionData.id, { selectedTalents: newSelected });
    }, [sectionData.selectedTalents, sectionData.id, onUpdate]);

    return (
        <div className="talent-card">
            {canDelete && (
                <button onClick={() => onDelete(sectionData.id)} className="delete-btn" title="Remove Section">
                    <Icons.Trash />
                </button>
            )}

            <div className="form-grid mb-4">
                <FormField label="Job Title / REQ Name" error={error} required>
                    <select
                        value={sectionData.jobTitle}
                        onChange={handleJobChange}
                        disabled={!clientName}
                        className={`input-field ${error ? 'input-error' : ''}`}
                    >
                        <option value="">-- Select Job --</option>
                        {availableJobs.map(job => <option key={job.reqId} value={job.title}>{job.title}</option>)}
                    </select>
                    {!clientName && <span style={{ fontSize: '0.75rem', color: '#f97316' }}>Select a client above first.</span>}
                </FormField>

                <FormField label="REQ ID / Assignment ID">
                    <input type="text" value={sectionData.reqId} readOnly className="input-field" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }} />
                </FormField>
            </div>

            {sectionData.reqId && (
                <div className="talent-list-container">
                    <div className="talent-list-header">Available Talents for {sectionData.jobTitle}</div>
                    {availableTalents.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>No talents found.</div>
                    ) : (
                        availableTalents.map(talent => (
                            <TalentRow
                                key={talent.id}
                                talent={{...talent, details: sectionData.selectedTalents[talent.id]}}
                                isSelected={!!sectionData.selectedTalents[talent.id]}
                                currency={currency}
                                onToggle={handleTalentToggle}
                                onDetailChange={handleTalentDetail}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
});

const ReadOnlyView = ({ formData, reqSections, onEdit, onReset }) => (
    <div className="app-wrapper">
        <div className="main-card">
            <div className="header" style={{ backgroundColor: '#16a34a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icons.Check /> Purchase Order Summary</h2>
                <button onClick={onEdit} className="btn" style={{ backgroundColor: 'white', color: '#15803d' }}>Edit Order</button>
            </div>

            <div className="form-body">
                <section>
                    <div className="section-title"><h3>PO Details</h3></div>
                    <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {[
                            ['Client Name', formData.clientName], ['PO Type', formData.poType], ['PO Number', formData.poNumber],
                            ['Received On', formData.receivedOn], ['Received From', `${formData.receivedFromName} (${formData.receivedFromEmail})`],
                            ['Duration', `${formData.poStartDate} to ${formData.poEndDate}`], ['Budget', `${formData.currency} ${formData.budget}`]
                        ].map(([label, value], i) => (
                            <div key={i}>
                                <span className="label">{label}</span>
                                <div style={{ fontWeight: 600, color: '#1f2937' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginTop: '2rem' }}>
                    <div className="section-title"><h3>Talent Allocations</h3></div>
                    {reqSections.map((sec, i) => (
                        <div key={i} className="talent-card">
                            <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                                <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '1.125rem' }}>{sec.jobTitle}</span>
                                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>REQ ID: {sec.reqId}</span>
                            </div>
                            <table style={{ width: '100%', fontSize: '0.875rem', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#e5e7eb', color: '#4b5563' }}>
                                <tr><th style={{ padding: '0.75rem' }}>Talent Name</th><th style={{ padding: '0.75rem' }}>Duration</th><th style={{ padding: '0.75rem' }}>Bill Rate</th></tr>
                                </thead>
                                <tbody>
                                {Object.values(sec.selectedTalents).map((talent, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: 500 }}>{talent.name}</td>
                                        <td style={{ padding: '0.75rem' }}>{talent.contractDuration}</td>
                                        <td style={{ padding: '0.75rem' }}>{formData.currency} {talent.billRate}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </section>
            </div>
            <div className="footer-actions" style={{ padding: '1.5rem' }}>
                <button onClick={onReset} className="btn btn-primary" style={{ backgroundColor: '#ef4444' }}><Icons.Reset /> Create New PO</button>
            </div>
        </div>
    </div>
);

const App = () => {
    const { formData, reqSections, errors, viewMode, successMsg, actions } = usePOForm();

    if (viewMode === 'VIEW') return <ReadOnlyView formData={formData} reqSections={reqSections} onEdit={actions.setEditMode} onReset={actions.resetForm} />;

    return (
        <div className="app-wrapper">
            <div className="main-card">
                <div className="header">
                    <h1><Icons.FileText /> Purchase Order Entry</h1>
                    <p>Create and manage talent purchase orders.</p>
                </div>

                {errors.general && <div className="alert alert-error"><strong>Validation Error: </strong>{errors.general}</div>}
                {successMsg && <div className="alert alert-success">{successMsg}</div>}

                <div className="form-body">
                    <PODetailsSection formData={formData} onFieldChange={actions.updateField} errors={errors} />
                    <section>
                        <div className="section-title" style={{ justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icons.User /><h2>Talent Details</h2></div>
                            {formData.poType === CONSTANTS.PO_TYPES.GROUP && (
                                <button type="button" onClick={actions.addReqSection} className="btn btn-add">
                                    <Icons.Plus /> Add Another REQ
                                </button>
                            )}
                        </div>
                        {reqSections.map((section) => (
                            <ReqSection
                                key={section.id}
                                sectionData={section}
                                clientName={formData.clientName}
                                currency={formData.currency}
                                error={errors[`jobTitle_${section.id}`]}
                                canDelete={formData.poType === CONSTANTS.PO_TYPES.GROUP && reqSections.length > 1}
                                onUpdate={actions.updateReqSection}
                                onDelete={actions.removeReqSection}
                            />
                        ))}
                    </section>
                    <div className="footer-actions">
                        <button onClick={actions.resetForm} className="btn btn-secondary"><Icons.Reset /> Reset</button>
                        <button onClick={actions.submitForm} className="btn btn-primary"><Icons.Save /> Submit Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;