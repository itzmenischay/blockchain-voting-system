import Election from "../models/Election.js";
import Vote from "../models/Vote.js";

export const createElection = async (req, res) => {
  try {
    const { title, description, candidates, startTime, endTime } = req.body;

    // validate fields
    if (!title || !candidates || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // validate candidates
    if (!Array.isArray(candidates)) {
      return res.status(400).json({
        success: false,
        message: "Candidates must be an array",
      });
    }

    const normalizedCandidates = candidates
      .map((candidate) => candidate.trim())
      .filter(Boolean);

    if (normalizedCandidates.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 candidates are required",
      });
    }

    // duplicate candidates check
    const uniqueCandidates = new Set(
      normalizedCandidates.map((candidate) => candidate.toLowerCase()),
    );

    if (uniqueCandidates.size !== normalizedCandidates.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate candidates are not allowed",
      });
    }

    // validate dates
    const start = new Date(startTime);

    const end = new Date(endTime);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // determine initial status
    const now = new Date();

    let status = "upcoming";

    if (now >= start && now <= end) {
      status = "active";
    }

    if (now > end) {
      status = "ended";
    }

    // create election
    const election = await Election.create({
      title: title.trim(),

      description: description?.trim() || "",

      candidates: normalizedCandidates,

      startTime: start,
      endTime: end,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Election created successfully",

      data: election,
    });
  } catch (error) {
    console.error("CREATE ELECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllElections = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // fetch elections
    const elections = await Election.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Election.countDocuments();

    return res.status(200).json({
      success: true,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },

      data: elections,
    });
  } catch (error) {
    console.error("GET ELECTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getElectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    // runtime lifecycle sync
    const now = new Date();

    let currentStatus = election.status;

    if (now < election.startTime) {
      currentStatus = "upcoming";
    } else if (now >= election.startTime && now <= election.endTime) {
      currentStatus = "active";
    } else {
      currentStatus = "ended";
    }

    // sync db if changed
    if (currentStatus !== election.status) {
      election.status = currentStatus;

      await election.save();
    }

    return res.status(200).json({
      success: true,
      data: election,
    });
  } catch (error) {
    console.error("GET ELECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateElection = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, candidates, startTime, endTime } = req.body;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    // ended elections immutable
    if (election.status === "ended") {
      return res.status(400).json({
        success: false,
        message: "Ended elections cannot be edited",
      });
    }

    // active election restrictions
    if (election.status === "active") {
      if (
        candidates &&
        JSON.stringify(candidates) !== JSON.stringify(election.candidates)
      ) {
        return res.status(400).json({
          success: false,
          message: "Cannot modify candidates during active election",
        });
      }
    }

    // normalize candidates
    let normalizedCandidates = election.candidates;

    if (candidates) {
      if (!Array.isArray(candidates)) {
        return res.status(400).json({
          success: false,
          message: "Candidates must be an array",
        });
      }

      normalizedCandidates = candidates
        .map((candidate) => candidate.trim())
        .filter(Boolean);

      if (normalizedCandidates.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 candidates are required",
        });
      }

      const uniqueCandidates = new Set(
        normalizedCandidates.map((candidate) => candidate.toLowerCase()),
      );

      if (uniqueCandidates.size !== normalizedCandidates.length) {
        return res.status(400).json({
          success: false,
          message: "Duplicate candidates are not allowed",
        });
      }
    }

    // validate dates
    const start = startTime ? new Date(startTime) : election.startTime;

    const end = endTime ? new Date(endTime) : election.endTime;

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // update fields
    election.title = title?.trim() || election.title;

    election.description = description?.trim() ?? election.description;

    election.candidates = normalizedCandidates;

    election.startTime = start;

    election.endTime = end;

    // runtime status recalculation
    const now = new Date();

    if (now < start) {
      election.status = "upcoming";
    } else if (now >= start && now <= end) {
      election.status = "active";
    } else {
      election.status = "ended";
    }

    await election.save();

    return res.status(200).json({
      success: true,
      message: "Election updated successfully",

      data: election,
    });
  } catch (error) {
    console.error("UPDATE ELECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    // prevent deleting active
    if (election.status === "active") {
      return res.status(400).json({
        success: false,
        message: "Active elections cannot be deleted",
      });
    }

    // check votes
    const voteExists = await Vote.exists({
      electionId: id,
    });

    if (voteExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete election with votes",
      });
    }

    await Election.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Election deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ELECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
