import { ethers } from "ethers";
import { useState } from "react";
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_EVENT_MANAGER!
import contract from '../contracts/EventManager.json'
export interface IEventGroup {
  groupId: number;
  name: string;
}
export interface IEventRecord {
  eventRecordId: number;
  groupId: number;
  eventName: string;
  description: string;
  date: Date;
  startTime: string; // "18:00"
  endTime: string; // "21:00"
}
export interface ICreateEventRecordParams {
  groupId: number;
  eventName: string;
  description: string;
  date: Date;
  startTime: string; // "18:00"
  endTime: string; // "21:00"
  secretPhrase: string;
}
/**
 * A bridgge to the event manager contract
*/
export const getEventManagerContract = () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum as any);
    const signer = provider.getSigner();
    if (signer) {
      console.log("address:", contractAddress);
      const _contract = new ethers.Contract(
        contractAddress,
        contract.abi,
        signer
      );
      console.log("Initialize payment");
      return _contract;
    }
  }
  return null;
};

/**
 * custom hook function for getting all event groups
 * 
 * @returns 
 */
export const useEventGroups = () => {
  const [groups, setGroups] = useState<IEventGroup[]>([]);
  const [loading, setLoading] = useState(false)
  const getEventGroups = async () => {
    console.log("get event groups");
    const eventManager = getEventManagerContract();
    if (!eventManager) throw "error";
    setLoading(true)
    const data = await eventManager.getGroups();
    setLoading(false)
    setGroups(data);
  };
  return { groups, loading, getEventGroups }
}

/**
 * custom hook function for get login user's groups
 */
export const useOwnEventGroups = () => {
  const [groups, setGroups] = useState<IEventGroup[]>([])
  const [loading, setLoading] = useState(false)
  const getOwnEventGroups = async () => {
    const eventManager = getEventManagerContract();
    if (!eventManager) throw "error: contract can't found";
    setLoading(true)
    const data = await eventManager.getOwnGroups();
    setLoading(false)
    setGroups(data);
  }
  return { groups, loading, getOwnEventGroups }
}

/**
 * custom hook function for creating an event record
 * @returns 
 */
export const useCreateEventRecord = () => {
  const [errors, setErrors] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const createEventRecord = async (params: ICreateEventRecordParams) => {
    const eventManager = getEventManagerContract();
    if (!eventManager) throw "error: contract can't found";
    setLoading(true)
    const datestr = params.date.toLocaleDateString();
    await eventManager.createEventRecord(params.groupId, params.eventName, params.description, datestr, params.startTime, params.endTime, params.secretPhrase);
    setLoading(false)
  }
  return { errors, loading, createEventRecord }
}

/**
 * custom hook function for getting all event groups
 * 
 * @returns 
 */
export const useEventRecords = () => {
  const [records, setRecords] = useState<IEventRecord[]>([]);
  const [loading, setLoading] = useState(false)
  const getEventRecords = async () => {
    console.log("get event records");
    const eventManager = getEventManagerContract();
    if (!eventManager) throw "error";
    setLoading(true)
    const data = await eventManager.getEventRecords();
    setLoading(false)
    setRecords(data);
  };
  return { records, loading, getEventRecords }
}