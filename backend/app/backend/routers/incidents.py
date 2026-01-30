import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.incidents import IncidentsService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/incidents", tags=["incidents"])


# ---------- Pydantic Schemas ----------
class IncidentsData(BaseModel):
    """Entity data schema (for create/update)"""
    organization_id: int
    location_id: int = None
    incident_type: str
    severity: str
    description: str
    immediate_action: str = None
    investigation_summary: str = None
    status: str
    photo_urls: str = None
    ai_suggested_classification: str = None
    created_at: Optional[datetime] = None


class IncidentsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    organization_id: Optional[int] = None
    location_id: Optional[int] = None
    incident_type: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    immediate_action: Optional[str] = None
    investigation_summary: Optional[str] = None
    status: Optional[str] = None
    photo_urls: Optional[str] = None
    ai_suggested_classification: Optional[str] = None
    created_at: Optional[datetime] = None


class IncidentsResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    organization_id: int
    location_id: Optional[int] = None
    incident_type: str
    severity: str
    description: str
    immediate_action: Optional[str] = None
    investigation_summary: Optional[str] = None
    status: str
    photo_urls: Optional[str] = None
    ai_suggested_classification: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class IncidentsListResponse(BaseModel):
    """List response schema"""
    items: List[IncidentsResponse]
    total: int
    skip: int
    limit: int


class IncidentsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[IncidentsData]


class IncidentsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: IncidentsUpdateData


class IncidentsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[IncidentsBatchUpdateItem]


class IncidentsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=IncidentsListResponse)
async def query_incidentss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query incidentss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying incidentss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = IncidentsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
            user_id=str(current_user.id),
        )
        logger.debug(f"Found {result['total']} incidentss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying incidentss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=IncidentsListResponse)
async def query_incidentss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query incidentss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying incidentss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = IncidentsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} incidentss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying incidentss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=IncidentsResponse)
async def get_incidents(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single incidents by ID (user can only see their own records)"""
    logger.debug(f"Fetching incidents with id: {id}, fields={fields}")
    
    service = IncidentsService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Incidents with id {id} not found")
            raise HTTPException(status_code=404, detail="Incidents not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching incidents {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=IncidentsResponse, status_code=201)
async def create_incidents(
    data: IncidentsData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new incidents"""
    logger.debug(f"Creating new incidents with data: {data}")
    
    service = IncidentsService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create incidents")
        
        logger.info(f"Incidents created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating incidents: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating incidents: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[IncidentsResponse], status_code=201)
async def create_incidentss_batch(
    request: IncidentsBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple incidentss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} incidentss")
    
    service = IncidentsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} incidentss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[IncidentsResponse])
async def update_incidentss_batch(
    request: IncidentsBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple incidentss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} incidentss")
    
    service = IncidentsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} incidentss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=IncidentsResponse)
async def update_incidents(
    id: int,
    data: IncidentsUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing incidents (requires ownership)"""
    logger.debug(f"Updating incidents {id} with data: {data}")

    service = IncidentsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Incidents with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Incidents not found")
        
        logger.info(f"Incidents {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating incidents {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating incidents {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_incidentss_batch(
    request: IncidentsBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple incidentss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} incidentss")
    
    service = IncidentsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} incidentss successfully")
        return {"message": f"Successfully deleted {deleted_count} incidentss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_incidents(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single incidents by ID (requires ownership)"""
    logger.debug(f"Deleting incidents with id: {id}")
    
    service = IncidentsService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Incidents with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Incidents not found")
        
        logger.info(f"Incidents {id} deleted successfully")
        return {"message": "Incidents deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting incidents {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")