import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";
//styles
import './JobList.scss';
//hooks
import useDebounce from "../../hooks/useDebounce";
//components
import { getJobListData, setJobsList } from "../../redux/pages/joblist/JoblistSlice";
//redux
import { useAppSelector } from "../../redux/hooks";

interface IJobList { };

const JobList: React.FC<IJobList> = () => {

    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

    const [jobsListData, setJobsListdata] = useState<any>("");
    const [showFilter, setShowFilter] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [filterdJobsList, setFilteredJobsList] = useState<any>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [filterApplied, setFilterApplied] = useState<boolean>(false);
    const [selectedJobItem, setSelectedJobItem] = useState<any>(null);

    const filterFormRef = useRef<any>();

    const dispatch = useDispatch<any>();
    const jobList = useAppSelector((state) => state.jobListSlice.jobsList);
    const isLoading = useAppSelector((state) => state.commonUISlice.loading);

    const searchTerm = useDebounce(searchKeyword?.trim(), 1000);

    useEffect(() => {
        dispatch(getJobListData({ offset: 0, limit: 12 }));
    }, []);

    useEffect(() => {
        if (jobList) {
            setJobsListdata(jobList);
            setFilteredJobsList([...jobList?.jdList]);
            dispatch(setJobsList(""));
        }
    }, [jobList]);

    //charecter search
    useEffect(() => {
        if ((searchTerm === "" || searchTerm?.length > 3) && jobsListData?.jdList?.length) {
            if (filterApplied) {
                handleFilter(filterFormRef?.current);
            } else {
                const filteredData = jobsListData?.jdList?.filter((item: any) =>
                    item.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    item.companyName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    item.jobRole.toLowerCase().includes(searchKeyword.toLowerCase())
                );
                setFilteredJobsList([...filteredData]);
            }
        }
    }, [searchTerm]);

    //search on enter keydown
    const onKeyPress = (event: any) => {
        if (event?.key === 'Enter') {
            const keyword = event?.target?.value?.trim();
            if (keyword !== "" && jobsListData?.jdList?.length) {
                if (filterApplied) {
                    handleFilter(filterFormRef?.current);
                } else {
                    const filteredData = jobsListData?.jdList?.filter((item: any) =>
                        item.location.toLowerCase().includes(keyword.toLowerCase()) ||
                        item.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
                        item.jobRole.toLowerCase().includes(keyword.toLowerCase())
                    );
                    setFilteredJobsList([...filteredData]);
                }
            }
        }
    };

    //pagination when scroll
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const container = event.currentTarget;
        const totalCount = jobsListData?.totalCount;
        if (container.scrollHeight - container.scrollTop === container.clientHeight && jobsListData?.jdList?.length < totalCount) {
            if (!filterApplied && searchTerm === "") {
                const body = { offset: jobsListData.jdList.length, limit: 12 }
                dispatch(getJobListData(body, jobsListData?.jdList));
            }
        }
    };

    const handleFilter = useCallback((data: any) => {
        if (jobsListData?.jdList?.length) {
            filterFormRef.current = data;
            let jobData: any = [];
            if (searchTerm !== "") {
                jobData = jobsListData?.jdList?.filter((item: any) =>
                    item.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    item.companyName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    item.jobRole.toLowerCase().includes(searchKeyword.toLowerCase())
                );
            } else {
                jobData = [...jobsListData?.jdList];
            };
            const allValuesNull = Object.values(data).every(value => value === null || value === '');
            let result: any = [];
            if (!allValuesNull) {
                jobData?.forEach((item: any) => {
                    if (item?.minExp && item?.minExp === +data?.minExp) {
                        result.push(item);
                        return;
                    };
                    if (item?.companyName && item?.companyName?.toLowerCase() === data?.companyName?.toLowerCase()) {
                        result.push(item);
                        return;
                    };
                    if (item?.location && item?.location?.toLowerCase() === data?.location?.toLowerCase()) {
                        result.push(item);
                        return;
                    };
                    if (item?.jobRole && item?.jobRole?.toLowerCase() === data?.jobRole?.toLowerCase()) {
                        result.push(item);
                        return;
                    };
                    if (item?.minJdSalary && item?.minJdSalary === +data?.minJdSalary) {
                        result.push(item);
                        return;
                    }
                });
                setFilterApplied(true);
            } else {
                result = [...jobData];
            }
            setFilteredJobsList([...result]);
            setShowFilter(false);
        }
    }, [jobsListData, searchTerm]);

    const clearFilter = () => {
        reset();
        setFilterApplied(false);
        let jobData = [];
        if (searchTerm !== "") {
            jobData = jobsListData?.jdList?.filter((item: any) =>
                item.location.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.companyName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.jobRole.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        } else {
            jobData = [...jobsListData?.jdList];
        };
        setFilteredJobsList([...jobData]);
    };

    return (
        <div className="container-fluid">
            <header className="sticky-top bg-white pt-3">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-md-8">
                            <div className="section-title text-center text-md-start">
                                <h4 className="title mb-4">Find the perfect jobs</h4>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex justify-content-end align-items-center p-3">
                            <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={onKeyPress} className="form-control me-2" placeholder="Search..." />
                            <button className="btn btn-link me-2" onClick={() => setShowFilter(!showFilter)}>
                                <i className="fas fa-filter"></i> Filter
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {showFilter && (
                <div className="custom-modal">
                    <div className="modal-header">
                        <h5 className="modal-title">Filters</h5>
                        <button type="button" className="btn-close" onClick={() => setShowFilter(!showFilter)} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(handleFilter)}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input type="text" className="form-control" placeholder="Minimum Experience" {...register("minExp")} />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" placeholder="Company Name" {...register("companyName")} />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" placeholder="Location" {...register("location")} />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" placeholder="Job Type" {...register("jobRole")} />
                                </div>
                                <div className="col-md-6">
                                    <input type="text" className="form-control" placeholder="Minimum Base Pay" {...register("minJdSalary")} />
                                </div>
                                <div className="row g-3">
                                    <div className="d-flex justify-content-end flex-grow-1">
                                        <button onClick={() => clearFilter()} className="btn btn-secondary me-2">Clear</button>
                                        <button type="submit" className="btn btn-primary">Search</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            )}
            <div className="content-wrapper" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }} onScroll={handleScroll}>
                <div className="container">
                    <div className="p-3">
                        <div className="row d-flex">
                            {filterdJobsList && filterdJobsList?.length ?
                                filterdJobsList?.map((item: any, key: any) => (
                                    <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2" key={key}>
                                        <div className="card border-0 bg-light rounded shadow">
                                            <div className="card-body p-4">
                                                {item?.location ? <span className="badge rounded-pill bg-primary float-md-end mb-3 mb-sm-0">{item?.location}</span> : null}
                                                <h5>
                                                    {item?.logoUrl ? <img src={item?.logoUrl} alt={item?.companyName} className="company-logo me-2" style={{ height: "50px", width: "50px" }} /> : null}
                                                    {item?.companyName}
                                                </h5>
                                                <h5> {item?.jobRole}</h5>
                                                <div className="mt-3 job-details overflow-ellipsis" style={{ maxHeight: "7.5em", overflow: "hidden" }}>
                                                    <span className="text-muted d-block">{item?.jobDetailsFromCompany}</span>
                                                </div>
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedJobItem(item);
                                                            setShowDetails(true);
                                                        }
                                                        } className="btn btn-primary">View Details</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : null}
                        </div>
                    </div>
                    {!filterdJobsList?.length && !isLoading ? (
                        <div className="pt-5 mt-5">
                            <div className="col-12">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-12 text-center">
                                        <div className=" alert-info bg-light" role="alert">
                                            <img src="https://icons.veryicon.com/png/o/business/financial-category/no-data-6.png" alt="No jobs found" className="img-fluid mb-2" style={{ width: '200px', height: '200px' }} />
                                            <div className="pb-5">
                                                <i className="fas fa-info-circle me-2"></i> No jobs found
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <Modal
                show={showDetails}
                onHide={() => {
                    setShowDetails(false);
                    setSelectedJobItem(null);
                }} >
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">{selectedJobItem?.jobRole}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    <h5>
                        {selectedJobItem?.logoUrl ? <img className="company-logo me-2" src={selectedJobItem?.logoUrl} alt={selectedJobItem?.companyName} style={{ height: "50px", width: "50px" }} /> : null}
                        {selectedJobItem?.companyName}
                        {selectedJobItem?.location ? <span className="badge rounded-pill bg-primary float-md-end mb-3 mb-sm-0">{selectedJobItem?.location}</span> : null}
                    </h5>
                    <div className="job-details">{selectedJobItem?.jobDetailsFromCompany}</div>
                    <div className="experience-ctc">
                        <p>
                            <span>Experience: </span>
                            {selectedJobItem?.minExp && selectedJobItem?.maxExp ? `${selectedJobItem.minExp} - ${selectedJobItem.maxExp}` :
                                selectedJobItem?.minExp ? `${selectedJobItem.minExp}+ years` :
                                    selectedJobItem?.maxExp ? `Up to ${selectedJobItem.maxExp} years` :
                                        'No experience requirement'
                            }
                        </p>

                        <p>
                            <span>CTC: </span>
                            {selectedJobItem?.minJdSalary && selectedJobItem?.maxJdSalary ? (
                                <>
                                    {selectedJobItem.salaryCurrencyCode && (
                                        <>{selectedJobItem?.salaryCurrencyCode}&nbsp;</>
                                    )}
                                    {selectedJobItem.minJdSalary} - {selectedJobItem.maxJdSalary}
                                </>
                            ) : selectedJobItem?.minJdSalary ? (
                                <>
                                    {selectedJobItem.salaryCurrencyCode && (
                                        <>{selectedJobItem.salaryCurrencyCode}&nbsp;</>
                                    )}
                                    {selectedJobItem.minJdSalary} INR
                                </>
                            ) : selectedJobItem?.maxJdSalary ? (
                                <>
                                    {selectedJobItem.salaryCurrencyCode && (
                                        <>{selectedJobItem.salaryCurrencyCode}&nbsp;</>
                                    )}
                                    Up to {selectedJobItem.maxJdSalary} INR
                                </>
                            ) : (
                                'Salary not specified'
                            )}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end flex-grow-1">
                        <button onClick={() => {
                            setShowDetails(false);
                            setSelectedJobItem(null);
                        }} className="btn btn-secondary me-2">Close</button>
                        <button onClick={() => window.open(`${selectedJobItem?.jdLink}`, "_blank")} className="btn btn-primary">Apply</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default memo(JobList);
