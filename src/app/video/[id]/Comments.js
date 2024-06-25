"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton";
import { addComment, deleteComment, editComment, likeCommentHandler } from "@root/actions/comment";
import moment from "moment";
import Image from "next/image";
import { useState, useEffect, useActionState } from "react";
import { TbEdit } from "react-icons/tb";
import { MdDelete, MdOutlineInsertComment } from "react-icons/md";
import { toast } from "react-toastify";
import Link from "next/link";
import { IoIosCloseCircleOutline, IoMdHeartEmpty } from "react-icons/io";
import { FcLike } from "react-icons/fc";

export const Comments = ({ comments }) => {
    const [showComments, setShowComments] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState({});

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <>
            <h4>
                {comments.length} Comments
            </h4>
            {isMobile && (
                <button
                    className="bg-indigo-400 hover:bg-indigo-500 text-white p-2 mt-4 rounded-md w-fit"
                    onClick={() => setShowComments(!showComments)}
                >
                    {showComments ? "Hide" : "Show"} Comments
                </button>
            )}
            {(showComments || !isMobile) && comments.map(comment => (
                <div key={comment._id} className="flex flex-row gap-x-4 border-b border-gray-200 pb-4">
                    <Image
                        src={comment.owner.avatar}
                        alt={comment.owner.name}
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col w-full">
                        <div className="w-full flex flex-row justify-between">
                            <div className="flex items-center">
                                <span className="font-bold">{comment.owner.name}</span>
                                <div className="text-gray-600 text-xs ml-2">{moment(comment.createdAt).fromNow()}</div>
                            </div>
                            {comment.isCurrUserOwnerOfComment && <div className="flex items-center gap-x-2">
                                <MdDelete
                                    size={20}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCommentToDelete(comment);
                                        setShowDeleteModal(true);
                                    }}
                                />
                                <TbEdit
                                    size={20}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCommentToEdit(comment);
                                        setShowEditModal(true);
                                    }}
                                />
                            </div>
                            }
                        </div>
                        <Link
                            href={`/user/${comment?.owner?._id}`}
                            className="text-gray-600 hover:text-gray-800 text-sm -mt-1 mb-1">@{comment.owner.username}</Link>
                        <div>{comment.content}</div>
                        <div className="flex flex-row gap-x-2 items-center">
                            {comment?.isLikedByCurrUser ?
                                <FcLike size={20} className="text-gray-400 cursor-pointer"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        let res = await likeCommentHandler(comment._id);
                                        if (res?.status === 200) {
                                            toast.success(res.message);
                                        }
                                        else {
                                            toast.error(res.message);
                                        }
                                    }}
                                />
                                :
                                <IoMdHeartEmpty size={20} className="text-gray-400 cursor-pointer"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        let res = await likeCommentHandler(comment._id);
                                        if (res?.status === 200) {
                                            toast.success(res.message);
                                        }
                                        else {
                                            toast.error(res.message);
                                        }
                                    }}
                                />
                            }
                            <span className="text-gray-600">{comment.totalLikes}</span>
                        </div>
                    </div>
                </div>
            ))}
            <DeleteCommentConfimationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                commentToDelete={commentToDelete}
            />
            <EditCommentModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                commentToEdit={commentToEdit}
            />
        </>
    );
};

const DeleteCommentConfimationModal = ({ isOpen, onClose, commentToDelete }) => {
    return (
        <>
            {(isOpen === true)
                ?
                <>
                    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                            <h2 className="text-2xl font-semibold mb-4">
                                <IoIosCloseCircleOutline
                                    onClick={onClose}
                                    className="cursor-pointer float-right"
                                />
                            </h2>
                            <div>
                                Are you sure you want to delete the comment
                                <span className="font-bold">&nbsp; &quot;{commentToDelete.content}&quot; &nbsp;</span>?
                                <span>
                                    This action cannot be undone, and this will <span className="text-red-600">permenantly</span> delete the comment.
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        let deleteResponse = await deleteComment(commentToDelete._id);
                                        if (deleteResponse.status === 200) {
                                            toast.success(deleteResponse.message, {
                                                onClick: () => onClose(),
                                                onClose: () => onClose(),
                                            });
                                        }
                                        else {
                                            toast.error(deleteResponse.message, {
                                                onClick: () => onClose(),
                                                onClose: () => onClose(),
                                            });
                                        }
                                    }}
                                >
                                    Yes
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onClose();
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </>
                :
                <></>
            }
        </>
    );
};

const EditCommentModal = ({ isOpen, onClose, commentToEdit }) => {
    const [state, formAction] = useActionState(editComment, null);

    useEffect(() => {
        if (state?.status === 200) {
            toast.success(state.message, {
                onClick: () => onClose(),
                onClose: () => onClose()
            });
        }
        else if (state?.status !== 200 && state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <>
            {(isOpen === true)
                ?
                <>
                    <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="w-4/5 lg:w-2/5 mx-auto p-6 bg-white shadow-md rounded-xl overflow-y-auto max-h-screen">
                            <h2 className="text-2xl font-semibold mb-4">
                                Edit Comment
                                <IoIosCloseCircleOutline
                                    onClick={onClose}
                                    className="cursor-pointer float-right"
                                />
                            </h2>
                            <div>
                                <form action={formAction} className="w-full">
                                    <textarea
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                                        placeholder="Edit your comment..."
                                        name="comment"
                                        required
                                        minLength={5}
                                        defaultValue={commentToEdit.content}
                                    />
                                    <input type="hidden" name="commentID" value={commentToEdit._id} />
                                    <SubmitButton
                                        title={
                                            <>
                                                <MdOutlineInsertComment size={20} className="mr-2 sm:hidden" />
                                                <span className="max-sm:hidden">Save</span>
                                            </>
                                        }
                                        size="fit"
                                        className="ml-auto mt-2"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </>
                :
                <></>
            }
        </>
    );
};

export const CommentsForm = ({ videoID }) => {
    const [state, formAction] = useActionState(addComment, null);

    useEffect(() => {
        if (state?.status === 200) {
            toast.success(state.message, {
                onClick: () => document.getElementById("commentForm").reset(),
                onClose: () => document.getElementById("commentForm").reset()
            });
        }
        else if (state?.status !== 200 && state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <>
            <form action={formAction} className="w-full" id="commentForm">
                <div className="flex flex-col w-full">
                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 peer placeholder-transparent"
                        placeholder="Add a public comment..."
                        name="comment"
                        required
                        minLength={5}
                    />
                    <input type="hidden" name="videoID" value={videoID} />
                    <SubmitButton
                        title={
                            <>
                                <MdOutlineInsertComment size={20} className="mr-2 sm:hidden" />
                                <span className="max-sm:hidden">Comment</span>
                            </>
                        }
                        size="fit"
                        className="ml-auto mt-2"
                    />
                </div>
            </form>
        </>);
};