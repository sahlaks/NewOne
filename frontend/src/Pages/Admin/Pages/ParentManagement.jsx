import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import {
  blockParent,
  deleteParent,
  fetchParents,
} from "../../../Services/API/AdminAPI";
import { toast } from "react-toastify";
import Loading from "../../../Components/Loading/Loading";
import { TrashIcon, BanIcon, CheckIcon } from "@heroicons/react/solid";
import CustomPopup from "../../../Components/CustomPopUp/CustomPopup";
import Pagination from "../../../Components/Pagination/Pagination";

function ParentManagement() {
  const [loading, setLoading] = useState(true);
  const [parents, setParents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showPopup, setShowPopup] = useState(false);
  const [parentToBlock, setParentToBlock] = useState(null);
  const [parentToDelete, setParentToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const fetchParentData = async (page = 1, limit = 6) => {
    setLoading(true);
    try {
      const response = await fetchParents(page, limit);
      if (response.data.success) {
        setParents(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      console.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchParentData(page);
  };

  useEffect(() => {
    fetchParentData();
  }, []);

  const handleBlock = (e, parent) => {
    e.preventDefault();
    setParentToBlock(parent);
    setShowPopup(true);
  };

  const handleBlockConfirm = async () => {
    try {
      const res = await blockParent(parentToBlock._id);
      if (res.data.success) {
        toast.success(
          parentToBlock.isBlocked ? "Parent unblocked" : "Parent blocked"
        );
        setParents((prevParents) =>
          prevParents.map((parent) =>
            parent._id === parentToBlock._id
              ? { ...parent, isBlocked: !parent.isBlocked }
              : parent
          )
        );
        setShowPopup(false);
      }
    } catch (err) {
      console.error("Error blocking/unblocking parent:", err);
    }
  };

  const handleDelete = (e, parent) => {
    e.preventDefault();
    setParentToDelete(parent);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await deleteParent(parentToDelete._id);
      if (res.data.success) {
        toast.success("Parent deleted successfully");
        setParents((prevParents) =>
          prevParents.filter((parent) => parent._id !== parentToDelete._id)
        );
        setShowDeletePopup(false);
      } else {
        toast.error("Failed to delete parent");
      }
    } catch (err) {
      console.error("Error deleting parent:", err);
      toast.error("Error deleting parent");
    }
  };

  return (
    <div>
      <AdminLayout>
        {loading ? (
          <Loading />
        ) : (
          <>
            <table className="table-auto border-collapse border border-gray-300 w-full hidden md:table bg-[#DDD0C8]">
              <thead>
                <tr className="bg-white border-b border-gray-300">
                  <th className="border-r border-gray-300 px-4 py-2 text-center">
                    No.
                  </th>
                  <th className="border-r border-gray-300 px-4 py-2 text-center">
                    Name
                  </th>
                  <th className="border-r border-gray-300 px-4 py-2 text-center">
                    Email
                  </th>
                  <th className="border-r border-gray-300 px-4 py-2 text-center">
                    Child Name
                  </th>
                  <th className="border-r border-gray-300 px-4 py-2 text-center">
                    Status
                  </th>
                  <th className="border-r border-gray-300 px-4 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray">
                {parents.map((parent, index) => (
                  <tr key={parent._id}>
                    <td className="border-r border-gray px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-r border-gray px-4 py-2 text-center">
                      {parent.parentName}
                    </td>
                    <td className="border-r border-gray px-4 py-2 text-center">
                      {parent.email}
                    </td>
                    <td className="border-r border-gray px-4 py-2 text-center">
                      {parent.children.map((child)=>(
                        <div key={child._id}>
                        <p><strong>Name:</strong> {child.name}</p>
                        <p><strong>Age:</strong> {child.age}</p>
                        <p><strong>Gender:</strong> {child.gender}</p>
                      </div>
                      ))}
                    </td>
                    <td className="border-r border-gray-300 px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded ${
                          parent.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {parent.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-[#323232]-500 hover:text-[#323232]-700 ml-4"
                        onClick={(e) => handleBlock(e, parent)}
                      >
                        {parent.isBlocked ? (
                          <CheckIcon className="h-5 w-5 inline-block" />
                        ) : (
                          <BanIcon className="h-5 w-5 inline-block" />
                        )}
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 m-4"
                        onClick={(e) => handleDelete(e, parent)}
                      >
                        <TrashIcon className="h-5 w-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden ">
              {parents.map((parent) => (
                <div
                  key={parent._id}
                  className="border border-[#FAF5E9]-500 shadow-lg p-4 mb-4"
                >
                  <p>
                    <strong>Name:</strong> {parent.parentName}
                  </p>
                  <p>
                    <strong>Email:</strong> {parent.email}
                  </p>
                  <p>
                    <strong>Child Name:</strong> {parent.childName}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {parent.isBlocked ? "Blocked" : "Active"}
                  </p>
                  <button
                    className={`${parent.isBlocked ? "bg-[#DDD0C8]" : "bg-[#DDD0C8]"} px-2 py-1 rounded`}
                    onClick={(e) => handleBlock(e, parent)}
                  >
                    {parent.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    onClick={(e) => handleDelete(e, parent)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {showPopup && (
              <CustomPopup
                title={
                  parentToBlock.isBlocked ? "Unblock Parent" : "Block Parent"
                }
                message={`Are you sure you want to ${
                  parentToBlock.isBlocked ? "unblock" : "block"
                } this parent?`}
                onConfirm={handleBlockConfirm}
                onCancel={() => setShowPopup(false)}
              />
            )}

            {showDeletePopup && (
              <CustomPopup
                title="Delete Parent"
                message={`Are you sure you want to delete this parent? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeletePopup(false)}
              />
            )}
          </>
        )}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
      </AdminLayout>
          
          
    </div>
  );
}

export default ParentManagement;
