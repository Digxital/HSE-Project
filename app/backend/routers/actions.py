import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.actions import ActionsService
from dependencies.auth import get_current_user
from schemas.auth import UserResponse

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/actions", tags=["actions"])


# ---------- Pydantic Schemas ----------
class ActionsData(BaseModel):
    """Entity data schema (for create/update)"""
    organization_id: int
    related_type: str = None
    related_id: int = None
    title: str
    description: str = None
    owner_id: str = None
    owner_name: str = None
    status: str
    priority: str
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    verification_status: str = None
    verification_notes: str = None
    evidence_urls: str = None
    created_at: Optional[datetime] = None


class ActionsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    organization_id: Optional[int] = None
    related_type: Optional[str] = None
    related_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    owner_id: Optional[str] = None
    owner_name: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    verification_status: Optional[str] = None
    verification_notes: Optional[str] = None
    evidence_urls: Optional[str] = None
    created_at: Optional[datetime] = None


class ActionsResponse(BaseModel):
    """Entity response schema"""
    id: int
    user_id: str
    organization_id: int
    related_type: Optional[str] = None
    related_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    owner_id: Optional[str] = None
    owner_name: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    verification_status: Optional[str] = None
    verification_notes: Optional[str] = None
    evidence_urls: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActionsListResponse(BaseModel):
    """List response schema"""
    items: List[ActionsResponse]
    total: int
    skip: int
    limit: int


class ActionsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[ActionsData]


class ActionsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: ActionsUpdateData


class ActionsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[ActionsBatchUpdateItem]


class ActionsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=ActionsListResponse)
async def query_actionss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Query actionss with filtering, sorting, and pagination (user can only see their own records)"""
    logger.debug(f"Querying actionss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = ActionsService(db)
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
        logger.debug(f"Found {result['total']} actionss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying actionss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=ActionsListResponse)
async def query_actionss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query actionss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying actionss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = ActionsService(db)
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
        logger.debug(f"Found {result['total']} actionss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying actionss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=ActionsResponse)
async def get_actions(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single actions by ID (user can only see their own records)"""
    logger.debug(f"Fetching actions with id: {id}, fields={fields}")
    
    service = ActionsService(db)
    try:
        result = await service.get_by_id(id, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Actions with id {id} not found")
            raise HTTPException(status_code=404, detail="Actions not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching actions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=ActionsResponse, status_code=201)
async def create_actions(
    data: ActionsData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new actions"""
    logger.debug(f"Creating new actions with data: {data}")
    
    service = ActionsService(db)
    try:
        result = await service.create(data.model_dump(), user_id=str(current_user.id))
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create actions")
        
        logger.info(f"Actions created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating actions: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating actions: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[ActionsResponse], status_code=201)
async def create_actionss_batch(
    request: ActionsBatchCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create multiple actionss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} actionss")
    
    service = ActionsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump(), user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} actionss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[ActionsResponse])
async def update_actionss_batch(
    request: ActionsBatchUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update multiple actionss in a single request (requires ownership)"""
    logger.debug(f"Batch updating {len(request.items)} actionss")
    
    service = ActionsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict, user_id=str(current_user.id))
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} actionss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=ActionsResponse)
async def update_actions(
    id: int,
    data: ActionsUpdateData,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update an existing actions (requires ownership)"""
    logger.debug(f"Updating actions {id} with data: {data}")

    service = ActionsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict, user_id=str(current_user.id))
        if not result:
            logger.warning(f"Actions with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Actions not found")
        
        logger.info(f"Actions {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating actions {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating actions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_actionss_batch(
    request: ActionsBatchDeleteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple actionss by their IDs (requires ownership)"""
    logger.debug(f"Batch deleting {len(request.ids)} actionss")
    
    service = ActionsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id, user_id=str(current_user.id))
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} actionss successfully")
        return {"message": f"Successfully deleted {deleted_count} actionss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_actions(
    id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a single actions by ID (requires ownership)"""
    logger.debug(f"Deleting actions with id: {id}")
    
    service = ActionsService(db)
    try:
        success = await service.delete(id, user_id=str(current_user.id))
        if not success:
            logger.warning(f"Actions with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Actions not found")
        
        logger.info(f"Actions {id} deleted successfully")
        return {"message": "Actions deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting actions {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")